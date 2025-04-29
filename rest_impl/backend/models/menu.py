from app import db
from datetime import datetime

class Category(db.Model):
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text)
    
    menu_items = db.relationship('MenuItem', backref='category', lazy=True)

class MenuItem(db.Model):
    __tablename__ = 'menu_items'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(200))
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    is_available = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Additional attributes
    dietary_info = db.Column(db.String(100))  # vegetarian, vegan, gluten-free, etc.
    spice_level = db.Column(db.String(20))    # mild, medium, spicy
    is_featured = db.Column(db.Boolean, default=False)

def create_sample_menu_items():
    """Create sample menu items if they don't exist"""
    from app import db
    
    # Check if we already have menu items
    if MenuItem.query.count() > 0:
        return
    
    # Create categories
    categories = {
        'starters': Category(name='Starters', description='Appetizers and small plates to start your meal'),
        'main_courses': Category(name='Main Courses', description='Hearty main dishes'),
        'desserts': Category(name='Desserts', description='Sweet treats to finish your meal'),
        'beverages': Category(name='Beverages', description='Refreshing drinks')
    }
    
    for category in categories.values():
        db.session.add(category)
    
    # Create menu items
    menu_items = [
        # Starters
        MenuItem(
            name='Bruschetta',
            description='Grilled bread rubbed with garlic and topped with diced tomatoes, fresh basil, and olive oil.',
            price=8.99,
            category=categories['starters'],
            dietary_info='vegetarian',
            spice_level='mild'
        ),
        MenuItem(
            name='Crispy Calamari',
            description='Tender squid lightly battered and fried, served with marinara sauce and lemon aioli.',
            price=10.99,
            category=categories['starters'],
            spice_level='medium',
            is_featured=True
        ),
        
        # Main Courses
        MenuItem(
            name='Grilled Ribeye Steak',
            description='Prime ribeye steak grilled to perfection, served with roasted vegetables and garlic mashed potatoes.',
            price=18.99,
            category=categories['main_courses'],
            spice_level='medium',
            is_featured=True
        ),
        MenuItem(
            name='Wild Mushroom Risotto',
            description='Creamy Arborio rice cooked with assorted wild mushrooms, white wine, and Parmesan cheese.',
            price=16.99,
            category=categories['main_courses'],
            dietary_info='vegetarian',
            spice_level='mild'
        ),
        MenuItem(
            name='Spicy Grilled Chicken',
            description='Marinated chicken breast grilled with spices, served with sautéed vegetables and cilantro lime rice.',
            price=15.99,
            category=categories['main_courses'],
            spice_level='spicy'
        ),
        
        # Desserts
        MenuItem(
            name='New York Cheesecake',
            description='Creamy cheesecake with a graham cracker crust, topped with fresh berries and berry coulis.',
            price=7.99,
            category=categories['desserts'],
            dietary_info='vegetarian',
            spice_level='mild',
            is_featured=True
        ),
        MenuItem(
            name='Chocolate Lava Cake',
            description='Warm chocolate cake with a molten chocolate center, served with vanilla ice cream.',
            price=6.99,
            category=categories['desserts'],
            dietary_info='vegetarian,gluten-free',
            spice_level='mild'
        ),
        
        # Beverages
        MenuItem(
            name='Mixed Berry Smoothie',
            description='Refreshing smoothie made with mixed berries, banana, and almond milk.',
            price=4.99,
            category=categories['beverages'],
            dietary_info='vegan,gluten-free',
            spice_level='mild'
        ),
        MenuItem(
            name='Fresh Mint Lemonade',
            description='Homemade lemonade with fresh mint leaves and a hint of honey.',
            price=3.99,
            category=categories['beverages'],
            dietary_info='vegan,gluten-free',
            spice_level='mild'
        )
    ]
    
    for item in menu_items:
        db.session.add(item)
    
    db.session.commit()