from app import db
from datetime import datetime

class Table(db.Model):
    __tablename__ = 'tables'
    
    id = db.Column(db.Integer, primary_key=True)
    table_number = db.Column(db.String(10), nullable=False, unique=True)
    seats = db.Column(db.Integer, nullable=False)
    section = db.Column(db.String(50))  # window, center, patio, private
    status = db.Column(db.String(20), default='available')  # available, reserved, occupied
    
    # Relationships
    reservations = db.relationship('Reservation', backref='table', lazy=True)

class Reservation(db.Model):
    __tablename__ = 'reservations'
    
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    table_id = db.Column(db.Integer, db.ForeignKey('tables.id'), nullable=False)
    reservation_date = db.Column(db.Date, nullable=False)
    reservation_time = db.Column(db.Time, nullable=False)
    guests = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, confirmed, cancelled, completed
    special_requests = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

def create_sample_tables():
    """Create sample tables if they don't exist"""
    from app import db
    
    # Check if we already have tables
    if Table.query.count() > 0:
        return
    
    # Create tables
    tables = [
        # Window section
        Table(table_number='T1', seats=2, section='window'),
        Table(table_number='T2', seats=2, section='window'),
        Table(table_number='T3', seats=4, section='window'),
        Table(table_number='T4', seats=4, section='window'),
        
        # Center section
        Table(table_number='T5', seats=2, section='center'),
        Table(table_number='T6', seats=2, section='center'),
        Table(table_number='T7', seats=4, section='center'),
        Table(table_number='T8', seats=4, section='center'),
        Table(table_number='T9', seats=6, section='center'),
        
        # Private section
        Table(table_number='T10', seats=8, section='private'),
        Table(table_number='T11', seats=4, section='private'),
        
        # Patio section
        Table(table_number='P1', seats=2, section='patio'),
        Table(table_number='P2', seats=2, section='patio'),
        Table(table_number='P3', seats=4, section='patio'),
        Table(table_number='P4', seats=4, section='patio'),
    ]
    
    for table in tables:
        db.session.add(table)
    
    db.session.commit()