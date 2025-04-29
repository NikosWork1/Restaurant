from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config

# Initialize Flask extensions
db = SQLAlchemy()
jwt = JWTManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    CORS(app)
    
    # Import and register blueprints
    from routes.auth import auth_bp
    from routes.menu import menu_bp
    from routes.order import order_bp
    from routes.reservation import reservation_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(menu_bp, url_prefix='/api/menu')
    app.register_blueprint(order_bp, url_prefix='/api/orders')
    app.register_blueprint(reservation_bp, url_prefix='/api/reservations')
    
    # Create database tables
    with app.app_context():
        db.create_all()
        
        # Create initial data if needed
        from models.user import create_sample_users
        from models.menu import create_sample_menu_items
        create_sample_users()
        create_sample_menu_items()
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)