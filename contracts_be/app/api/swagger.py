"""
Swagger/OpenAPI Documentation Setup
"""
def init_swagger(app):
    """Initialize Flask-RESTX Swagger documentation"""
    try:
        from flask_restx import Api
        # Swagger is available at /api/docs
        # We use it in documentation mode only (routes are defined via Blueprints)
        app.logger.info("Swagger docs available at /api/docs")
    except ImportError:
        app.logger.warning("Flask-RESTX not available, Swagger docs disabled")
