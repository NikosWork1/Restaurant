from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.reservation import Reservation, Table, create_sample_tables
from models.user import User
from extensions import db
from datetime import datetime, time, timedelta

reservation_bp = Blueprint('reservation', __name__)

# Initialize tables if needed
@reservation_bp.before_app_request
def init_tables():
    create_sample_tables()

@reservation_bp.route('/tables', methods=['GET'])
def get_tables():
    # Get all tables
    tables = Table.query.all()
    
    # Format result
    result = [{
        'id': table.id,
        'table_number': table.table_number,
        'seats': table.seats,
        'section': table.section,
        'status': table.status
    } for table in tables]
    
    return jsonify(result), 200

@reservation_bp.route('/tables/availability', methods=['GET'])
def check_table_availability():
    # Get query parameters
    date_str = request.args.get('date')
    time_str = request.args.get('time')
    guests = request.args.get('guests', type=int)
    section = request.args.get('section')
    
    # Validate parameters
    if not date_str or not time_str:
        return jsonify({'message': 'Date and time are required'}), 400
    
    try:
        # Parse date and time
        date = datetime.strptime(date_str, '%Y-%m-%d').date()
        time_obj = datetime.strptime(time_str, '%H:%M').time()
    except ValueError:
        return jsonify({'message': 'Invalid date or time format'}), 400
    
    # Query base - get all tables
    query = Table.query
    
    # Filter by section if provided
    if section:
        query = query.filter_by(section=section)
    
    # Filter by seats if guests provided
    if guests:
        # Get tables that can accommodate the party
        query = query.filter(Table.seats >= guests)
    
    tables = query.all()
    
    # Check which tables are available at the requested time
    available_tables = []
    for table in tables:
        # Check if table is already reserved at the requested time
        # Look for reservations on the same date with overlapping times
        # Assume a reservation lasts 2 hours
        start_time = time_obj
        end_time = (datetime.combine(datetime.min, time_obj) + timedelta(hours=2)).time()
        
        reservation_exists = Reservation.query.filter(
            Reservation.table_id == table.id,
            Reservation.reservation_date == date,
            Reservation.status.in_(['pending', 'confirmed']),
            # Check if the reservation time overlaps with the requested time
            ((Reservation.reservation_time <= start_time) & 
             ((datetime.combine(datetime.min, Reservation.reservation_time) + timedelta(hours=2)).time() > start_time))
            |
            ((Reservation.reservation_time < end_time) & 
             (Reservation.reservation_time >= start_time))
        ).first()
        
        if not reservation_exists:
            available_tables.append({
                'id': table.id,
                'table_number': table.table_number,
                'seats': table.seats,
                'section': table.section
            })
    
    return jsonify(available_tables), 200

@reservation_bp.route('/', methods=['POST'])
@jwt_required()
def create_reservation():
    current_user = get_jwt_identity()
    user_id = current_user['id']
    
    # Only customers can make reservations
    user = User.query.get(user_id)
    if user.role != 'customer':
        return jsonify({'message': 'Only customers can make reservations'}), 403
    
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['table_id', 'reservation_date', 'reservation_time', 'guests']
    for field in required_fields:
        if field not in data:
            return jsonify({'message': f'Missing {field}'}), 400
    
    # Parse date and time
    try:
        reservation_date = datetime.strptime(data['reservation_date'], '%Y-%m-%d').date()
        reservation_time = datetime.strptime(data['reservation_time'], '%H:%M').time()
    except ValueError:
        return jsonify({'message': 'Invalid date or time format'}), 400
    
    # Check if table exists
    table = Table.query.get(data['table_id'])
    if not table:
        return jsonify({'message': 'Table not found'}), 404
    
    # Check if table has enough seats
    if table.seats < data['guests']:
        return jsonify({'message': 'Table does not have enough seats'}), 400
    
    # Check if table is available at the requested time
    start_time = reservation_time
    end_time = (datetime.combine(datetime.min, start_time) + timedelta(hours=2)).time()
    
    reservation_exists = Reservation.query.filter(
        Reservation.table_id == table.id,
        Reservation.reservation_date == reservation_date,
        Reservation.status.in_(['pending', 'confirmed']),
        # Check if the reservation time overlaps with the requested time
        ((Reservation.reservation_time <= start_time) & 
         ((datetime.combine(datetime.min, Reservation.reservation_time) + timedelta(hours=2)).time() > start_time))
        |
        ((Reservation.reservation_time < end_time) & 
         (Reservation.reservation_time >= start_time))
    ).first()
    
    if reservation_exists:
        return jsonify({'message': 'Table is not available at the requested time'}), 400
    
    # Create reservation
    reservation = Reservation(
        customer_id=user_id,
        table_id=data['table_id'],
        reservation_date=reservation_date,
        reservation_time=reservation_time,
        guests=data['guests'],
        special_requests=data.get('special_requests', ''),
        status='pending'
    )
    
    db.session.add(reservation)
    db.session.commit()
    
    return jsonify({
        'message': 'Reservation created successfully',
        'reservation_id': reservation.id,
        'status': reservation.status
    }), 201

@reservation_bp.route('/', methods=['GET'])
@jwt_required()
def get_reservations():
    current_user = get_jwt_identity()
    user_id = current_user['id']
    user_role = current_user['role']
    
    # Get query parameters
    status = request.args.get('status')
    date = request.args.get('date')
    
    # Different queries based on user role
    if user_role == 'customer':
        query = Reservation.query.filter_by(customer_id=user_id)
    elif user_role in ['staff', 'admin']:
        query = Reservation.query
    else:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    # Apply filters
    if status:
        query = query.filter_by(status=status)
    
    if date:
        try:
            date_obj = datetime.strptime(date, '%Y-%m-%d').date()
            query = query.filter_by(reservation_date=date_obj)
        except ValueError:
            return jsonify({'message': 'Invalid date format'}), 400
    
    # Order by date and time (newest first)
    reservations = query.order_by(Reservation.reservation_date.desc(),
                                 Reservation.reservation_time.desc()).all()
    
    # Format result
    result = []
    for reservation in reservations:
        table = Table.query.get(reservation.table_id)
        result.append({
            'id': reservation.id,
            'reservation_date': reservation.reservation_date.strftime('%Y-%m-%d'),
            'reservation_time': reservation.reservation_time.strftime('%H:%M'),
            'guests': reservation.guests,
            'status': reservation.status,
            'special_requests': reservation.special_requests,
            'created_at': reservation.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'table': {
                'id': table.id,
                'table_number': table.table_number,
                'seats': table.seats,
                'section': table.section
            }
        })
    
    return jsonify(result), 200

@reservation_bp.route('/<int:reservation_id>', methods=['GET'])
@jwt_required()
def get_reservation(reservation_id):
    current_user = get_jwt_identity()
    user_id = current_user['id']
    user_role = current_user['role']
    
    # Get the reservation
    reservation = Reservation.query.get_or_404(reservation_id)
    
    # Check permissions
    if user_role == 'customer' and reservation.customer_id != user_id:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    # Get the table
    table = Table.query.get(reservation.table_id)
    
    # Format result
    result = {
        'id': reservation.id,
        'reservation_date': reservation.reservation_date.strftime('%Y-%m-%d'),
        'reservation_time': reservation.reservation_time.strftime('%H:%M'),
        'guests': reservation.guests,
        'status': reservation.status,
        'special_requests': reservation.special_requests,
        'created_at': reservation.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        'table': {
            'id': table.id,
            'table_number': table.table_number,
            'seats': table.seats,
            'section': table.section
        }
    }
    
    return jsonify(result), 200

@reservation_bp.route('/<int:reservation_id>/status', methods=['PUT'])
@jwt_required()
def update_reservation_status(reservation_id):
    current_user = get_jwt_identity()
    user_role = current_user['role']
    
    # Only staff and admin can update reservation status
    if user_role not in ['staff', 'admin']:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    # Get the reservation
    reservation = Reservation.query.get_or_404(reservation_id)
    
    data = request.get_json()
    
    # Validate status
    if 'status' not in data:
        return jsonify({'message': 'Status is required'}), 400
    
    valid_statuses = ['pending', 'confirmed', 'cancelled', 'completed']
    if data['status'] not in valid_statuses:
        return jsonify({'message': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'}), 400
    
    # Update reservation status
    reservation.status = data['status']
    db.session.commit()
    
    return jsonify({'message': 'Reservation status updated successfully'}), 200

@reservation_bp.route('/<int:reservation_id>/cancel', methods=['PUT'])
@jwt_required()
def cancel_reservation(reservation_id):
    current_user = get_jwt_identity()
    user_id = current_user['id']
    user_role = current_user['role']
    
    # Get the reservation
    reservation = Reservation.query.get_or_404(reservation_id)
    
    # Check permissions
    if user_role == 'customer' and reservation.customer_id != user_id:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    # Check if reservation can be cancelled
    if reservation.status in ['completed', 'cancelled']:
        return jsonify({'message': f'Cannot cancel reservation with status: {reservation.status}'}), 400
    
    # Cancel the reservation
    reservation.status = 'cancelled'
    db.session.commit()
    
    return jsonify({'message': 'Reservation cancelled successfully'}), 200