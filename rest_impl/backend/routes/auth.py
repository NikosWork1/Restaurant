from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models.user import User, Customer
from app import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing email or password'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'message': 'Invalid email or password'}), 401
    
    # Create access token
    access_token = create_access_token(identity={'id': user.id, 'role': user.role})
    
    return jsonify({
        'access_token': access_token,
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'role': user.role
        }
    }), 200

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['name', 'email', 'password', 'phone']
    for field in required_fields:
        if field not in data:
            return jsonify({'message': f'Missing {field}'}), 400
    
    # Check if email already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already registered'}), 400
    
    # Create new customer
    customer = Customer(
        name=data['name'],
        email=data['email'],
        phone=data['phone'],
        address=data.get('address', '')
    )
    
    customer.set_password(data['password'])
    
    # Save to database
    db.session.add(customer)
    db.session.commit()
    
    # Create access token
    access_token = create_access_token(identity={'id': customer.id, 'role': customer.role})
    
    return jsonify({
        'message': 'Registration successful',
        'access_token': access_token,
        'user': {
            'id': customer.id,
            'name': customer.name,
            'email': customer.email,
            'role': customer.role
        }
    }), 201

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user = get_jwt_identity()
    user_id = current_user['id']
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    # Return different information based on user role
    if user.role == 'customer':
        customer = Customer.query.get(user_id)
        return jsonify({
            'id': customer.id,
            'name': customer.name,
            'email': customer.email,
            'phone': customer.phone,
            'address': customer.address,
            'preferences': customer.preferences,
            'role': customer.role
        }), 200
    
    return jsonify({
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'phone': user.phone,
        'role': user.role
    }), 200

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user = get_jwt_identity()
    user_id = current_user['id']
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    data = request.get_json()
    
    # Update user fields
    if 'name' in data:
        user.name = data['name']
    if 'phone' in data:
        user.phone = data['phone']
    
    # Update password if provided
    if 'password' in data and data['password']:
        user.set_password(data['password'])
    
    # Update customer-specific fields
    if user.role == 'customer' and isinstance(user, Customer):
        if 'address' in data:
            user.address = data['address']
        if 'preferences' in data:
            user.preferences = data['preferences']
    
    db.session.commit()
    
    return jsonify({'message': 'Profile updated successfully'}), 200