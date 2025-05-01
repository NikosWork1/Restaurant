from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.menu import MenuItem, Category

menu_bp = Blueprint('menu', __name__)

@menu_bp.route('/', methods=['GET'])
def get_menu_items():
    # Get query parameters
    category = request.args.get('category')
    dietary = request.args.get('dietary')
    spice_level = request.args.get('spice_level')
    
    # Start with base query
    query = MenuItem.query.filter_by(is_available=True)
    
    # Apply filters
    if category:
        category_obj = Category.query.filter_by(name=category).first()
        if category_obj:
            query = query.filter_by(category_id=category_obj.id)
    
    if dietary:
        query = query.filter(MenuItem.dietary_info.like(f'%{dietary}%'))
    
    if spice_level:
        query = query.filter_by(spice_level=spice_level)
    
    # Get results
    menu_items = query.all()
    
    # Format results
    result = [{
        'id': item.id,
        'name': item.name,
        'description': item.description,
        'price': item.price,
        'image_url': item.image_url,
        'category': item.category.name,
        'dietary_info': item.dietary_info,
        'spice_level': item.spice_level,
        'is_featured': item.is_featured
    } for item in menu_items]
    
    return jsonify(result), 200

@menu_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    
    result = [{
        'id': category.id,
        'name': category.name,
        'description': category.description
    } for category in categories]
    
    return jsonify(result), 200

@menu_bp.route('/<int:item_id>', methods=['GET'])
def get_menu_item(item_id):
    item = MenuItem.query.get_or_404(item_id)
    
    result = {
        'id': item.id,
        'name': item.name,
        'description': item.description,
        'price': item.price,
        'image_url': item.image_url,
        'category': item.category.name,
        'dietary_info': item.dietary_info,
        'spice_level': item.spice_level,
        'is_featured': item.is_featured
    }
    
    return jsonify(result), 200

# Admin routes for managing menu items (protected)
@menu_bp.route('/', methods=['POST'])
@jwt_required()
def create_menu_item():
    # Check if user is admin
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Unauthorized access'}), 403
    
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['name', 'price', 'category_id']
    for field in required_fields:
        if field not in data:
            return jsonify({'message': f'Missing {field}'}), 400
    
    # Create new menu item
    menu_item = MenuItem(
        name=data['name'],
        description=data.get('description', ''),
        price=data['price'],
        image_url=data.get('image_url', ''),
        category_id=data['category_id'],
        dietary_info=data.get('dietary_info', ''),
        spice_level=data.get('spice_level', ''),
        is_featured=data.get('is_featured', False)
    )
    
    db.session.add(menu_item)
    db.session.commit()
    
    return jsonify({'message': 'Menu item created successfully', 'id': menu_item.id}), 201