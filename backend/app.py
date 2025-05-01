from flask import Flask
from extensions import db, jwt, cors
from config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)
    
    # Register blueprints
    from routes.auth import auth_bp
    from routes.menu import menu_bp
    from routes.order import order_bp
    from routes.reservation import reservation_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(menu_bp, url_prefix='/api/menu')
    app.register_blueprint(order_bp, url_prefix='/api/orders')
    app.register_blueprint(reservation_bp, url_prefix='/api/reservations')
    
    # Set up database initialization
    @app.route('/init-db')
    def init_db_route():
        initialize_database()
        return "Database initialized successfully!"
    
    return app

# Function to initialize database
def initialize_database():
    # Create tables
    with app.app_context():
        db.create_all()
        print("Database tables created successfully")
        
        # Initialize sample data with proper error handling
        try:
            # Import here to avoid circular imports
            from models.user import create_sample_users
            from models.menu import create_sample_menu_items
            from models.reservation import create_sample_tables
            
            # Create sample data
            create_sample_users()
            print("Sample users created successfully")
            
            create_sample_menu_items()
            print("Sample menu items created successfully")
            
            create_sample_tables()
            print("Sample tables created successfully")
            
            print("All sample data created successfully")
        except Exception as e:
            print(f"Error initializing sample data: {str(e)}")
            # Print the full exception for debugging
            import traceback
            traceback.print_exc()

# Create the Flask application instance
app = create_app()

# For direct execution of this file
if __name__ == '__main__':
    # Create tables immediately if running directly
    with app.app_context():
        db.create_all()
        print("Database tables created on startup")
        
        # Also initialize sample data on startup
        try:
            # Import here to avoid circular imports
            from models.user import create_sample_users
            from models.menu import create_sample_menu_items
            from models.reservation import create_sample_tables
            
            # Create sample data
            create_sample_users()
            create_sample_menu_items()
            create_sample_tables()
            print("Sample data initialized on startup")
        except Exception as e:
            print(f"Error initializing sample data: {str(e)}")
            import traceback
            traceback.print_exc()
    
    # Run the app
    app.run(debug=True)