"""
GRID-INDIA / ERLDC Enterprise CLM Platform
Flask Application Factory
"""
import os
from flask import Flask, jsonify
from flask_cors import CORS

from .extensions import db, migrate, jwt, limiter, celery_app
from .config import config_map


def create_app(config_name: str = None) -> Flask:
    """Application Factory Pattern"""
    if config_name is None:
        config_name = os.getenv("FLASK_ENV", "development")

    app = Flask(__name__, static_folder="../uploads")

    # Load config
    cfg = config_map.get(config_name, config_map["development"])
    app.config.from_object(cfg)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    limiter.init_app(app)
    celery_app.conf.update(app.config)

    # CORS
    CORS(
        app,
        resources={r"/api/*": {"origins": "*"}},
        supports_credentials=True,
    )

    # Import models to ensure they're registered
    with app.app_context():
        from . import models  # noqa: F401

    # Register Blueprints
    from .api.v1 import api_v1_bp
    app.register_blueprint(api_v1_bp, url_prefix="/api/v1")

    # Register legacy blueprint (for backward compat during migration)
    from .api.legacy import legacy_bp
    app.register_blueprint(legacy_bp)

    # Swagger
    from .api.swagger import init_swagger
    init_swagger(app)

    # CLI commands (seed-db, create-db)
    from .seed import register_cli
    register_cli(app)

    # Health check
    @app.route("/health")
    def health():
        return jsonify({"status": "ok", "service": "GRID-INDIA CLM Platform", "version": "2.0.0"})

    # JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({"error": "Token has expired", "code": "TOKEN_EXPIRED"}), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({"error": "Invalid token", "code": "INVALID_TOKEN"}), 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({"error": "Authorization required", "code": "UNAUTHORIZED"}), 401

    # Global error handlers
    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({"error": str(e), "code": "BAD_REQUEST"}), 400

    @app.errorhandler(403)
    def forbidden(e):
        return jsonify({"error": "Permission denied", "code": "FORBIDDEN"}), 403

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Resource not found", "code": "NOT_FOUND"}), 404

    @app.errorhandler(500)
    def internal_error(e):
        db.session.rollback()
        return jsonify({"error": "Internal server error", "code": "SERVER_ERROR"}), 500

    return app
