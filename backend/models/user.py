from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    role = db.Column(db.String(20), nullable=False)
    
    __mapper_args__ = {
        'polymorphic_identity': 'user',
        'polymorphic_on': role
    }
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Customer(User):
    __tablename__ = 'customers'
    
    id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    address = db.Column(db.String(200))
    preferences = db.Column(db.Text)
    
    orders = db.relationship('Order', backref='customer', lazy=True)
    reservations = db.relationship('Reservation', backref='customer', lazy=True)
    
    __mapper_args__ = {
        'polymorphic_identity': 'customer',
    }

class Staff(User):
    __tablename__ = 'staff'
    
    id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    position = db.Column(db.String(50))
    hire_date = db.Column(db.Date)
    
    __mapper_args__ = {
        'polymorphic_identity': 'staff',
    }

class Admin(User):
    __tablename__ = 'admins'
    
    id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    
    __mapper_args__ = {
        'polymorphic_identity': 'admin',
    }

def create_sample_users():
    """Create sample users if they don't exist"""
    # Don't import db here, it's already available at the top level
    
    # Use current_app to ensure we're in an app context
    from flask import current_app
    
    # Check if we already have users
    if User.query.count() > 0:
        print("Users already exist, skipping sample user creation")
        return
    
    print("Creating sample users...")
    
    try:
        # Create a customer
        customer = Customer(
            email='customer@example.com',
            name='John Doe',
            phone='555-123-4567',
            address='123 Main St, Anytown, USA'
        )
        customer.set_password('password123')
        
        # Create a staff member
        staff = Staff(
            email='staff@example.com',
            name='Jane Smith',
            phone='555-987-6543',
            position='Server',
            hire_date=datetime.now().date()
        )
        staff.set_password('password123')
        
        # Create an admin
        admin = Admin(
            email='admin@example.com',
            name='Admin User',
            phone='555-111-2222'
        )
        admin.set_password('password123')
        
        # Add to database
        db.session.add(customer)
        db.session.add(staff)
        db.session.add(admin)
        db.session.commit()
        
        print("Sample users created successfully")
    except Exception as e:
        db.session.rollback()
        print(f"Error creating sample users: {str(e)}")
        raise