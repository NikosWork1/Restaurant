from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.order import Order, OrderItem
from models.menu import MenuItem
from models.user import User
from app import db
from datetime import datetime

order_bp = Blueprint('order', __name__)

@order_bp.route('/', methods=['POST'])
@jwt_required()
def create_order():
    current_user = get_jwt_identity()
    user_id = current_user['id']
    
    # Only customers can place orders
    user = User.query.get(user_id)
    if user.role != 'customer':
        return jsonify({'message': 'Only customers can place orders'}), 403
    
    data = request.get_json()
    
    # Validate required fields
    if 'items' not in data or not data['items']:
        return jsonify({'message': 'Order must have at least one item'}), 400
    
    if 'order_type' not in data:
        return jsonify({'message': 'Order type is required'}), 400
    
    # Calculate total amount and validate items
    total_amount = 0
    order_items = []
    
    for item_data in data['items']:
        # Validate item data
        if 'menu_item_id' not in item_data or 'quantity' not in item_data:
            return jsonify({'message': 'Each item must have menu_item_id and quantity'}), 400
        
        # Get menu item
        menu_item = MenuItem.query.get(item_data['menu_item_id'])
        if not menu_item:
            return jsonify({'message': f'Menu item with ID {item_data["menu_item_id"]} not found'}), 400
        
        # Check if item is available
        if not menu_item.is_available:
            return jsonify({'message': f'Menu item {menu_item.name} is not available'}), 400
        
        # Calculate item total
        item_total = menu_item.price * item_data['quantity']
        total_amount += item_total
        
        # Create order item
        order_items.append({
            'menu_item_id': item_data['menu_item_id'],
            'quantity': item_data['quantity'],
            'price': menu_item.price,
            'special_instructions': item_data.get('special_instructions', '')
        })
    
    # Create new order
    order = Order(
        customer_id=user_id,
        order_type=data['order_type'],
        total_amount=total_amount,
        notes=data.get('notes', ''),
        status='pending'
    )
    
    db.session.add(order)
    db.session.flush()  # Get order ID
    
    # Create order items
    for item_data in order_items:
        order_item = OrderItem(
            order_id=order.id,
            menu_item_id=item_data['menu_item_id'],
            quantity=item_data['quantity'],
            price=item_data['price'],
            special_instructions=item_data['special_instructions']
        )
        db.session.add(order_item)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Order created successfully',
        'order_id': order.id,
        'status': order.status,
        'total_amount': order.total_amount
    }), 201

@order_bp.route('/', methods=['GET'])
@jwt_required()
def get_orders():
    current_user = get_jwt_identity()
    user_id = current_user['id']
    user_role = current_user['role']
    
    # Get query parameters
    status = request.args.get('status')
    
    # Different queries based on user role
    if user_role == 'customer':
        query = Order.query.filter_by(customer_id=user_id)
    elif user_role in ['staff', 'admin']:
        query = Order.query
    else:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    # Apply status filter if provided
    if status:
        query = query.filter_by(status=status)
    
    # Order by date (newest first)
    orders = query.order_by(Order.order_date.desc()).all()
    
    # Format result
    result = []
    for order in orders:
        order_data = {
            'id': order.id,
            'order_date': order.order_date.strftime('%Y-%m-%d %H:%M:%S'),
            'status': order.status,
            'total_amount': order.total_amount,
            'order_type': order.order_type,
            'payment_status': order.payment_status,
            'notes': order.notes,
            'items': []
        }
        
        # Add order items
        for item in order.items:
            menu_item = MenuItem.query.get(item.menu_item_id)
            order_data['items'].append({
                'id': item.id,
                'menu_item_id': item.menu_item_id,
                'name': menu_item.name if menu_item else 'Unknown Item',
                'quantity': item.quantity,
                'price': item.price,
                'special_instructions': item.special_instructions
            })
        
        result.append(order_data)
    
    return jsonify(result), 200

@order_bp.route('/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    current_user = get_jwt_identity()
    user_id = current_user['id']
    user_role = current_user['role']
    
    # Get the order
    order = Order.query.get_or_404(order_id)
    
    # Check permissions
    if user_role == 'customer' and order.customer_id != user_id:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    # Format result
    result = {
        'id': order.id,
        'order_date': order.order_date.strftime('%Y-%m-%d %H:%M:%S'),
        'status': order.status,
        'total_amount': order.total_amount,
        'order_type': order.order_type,
        'payment_status': order.payment_status,
        'notes': order.notes,
        'items': []
    }
    
    # Add order items
    for item in order.items:
        menu_item = MenuItem.query.get(item.menu_item_id)
        result['items'].append({
            'id': item.id,
            'menu_item_id': item.menu_item_id,
            'name': menu_item.name if menu_item else 'Unknown Item',
            'quantity': item.quantity,
            'price': item.price,
            'special_instructions': item.special_instructions
        })
    
    return jsonify(result), 200

@order_bp.route('/<int:order_id>/status', methods=['PUT'])
@jwt_required()
def update_order_status(order_id):
    current_user = get_jwt_identity()
    user_role = current_user['role']
    
    # Only staff and admin can update order status
    if user_role not in ['staff', 'admin']:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    # Get the order
    order = Order.query.get_or_404(order_id)
    
    data = request.get_json()
    
    # Validate status
    if 'status' not in data:
        return jsonify({'message': 'Status is required'}), 400
    
    valid_statuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled']
    if data['status'] not in valid_statuses:
        return jsonify({'message': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'}), 400
    
    # Update order status
    order.status = data['status']
    db.session.commit()
    
    return jsonify({'message': 'Order status updated successfully'}), 200

@order_bp.route('/<int:order_id>/cancel', methods=['PUT'])
@jwt_required()
def cancel_order(order_id):
    current_user = get_jwt_identity()
    user_id = current_user['id']
    user_role = current_user['role']
    
    # Get the order
    order = Order.query.get_or_404(order_id)
    
    # Check permissions
    if user_role == 'customer' and order.customer_id != user_id:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    # Check if order can be cancelled
    if order.status in ['completed', 'cancelled']:
        return jsonify({'message': f'Cannot cancel order with status: {order.status}'}), 400
    
    # Cancel the order
    order.status = 'cancelled'
    db.session.commit()
    
    return jsonify({'message': 'Order cancelled successfully'}), 200