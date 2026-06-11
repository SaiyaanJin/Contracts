"""
Utility decorators for RBAC and audit logging
"""
import json
import functools
from datetime import datetime
from flask import request, jsonify, g
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request

from ..extensions import db
from ..models.user import User
from ..models.audit import AuditLog


def require_auth(f):
    """Verify JWT and load current user"""
    @functools.wraps(f)
    def decorated(*args, **kwargs):
        try:
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            user = User.query.filter_by(id=user_id, is_active=True).first()
            if not user:
                return jsonify({"error": "User not found or inactive"}), 401
            g.current_user = user
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({"error": "Authentication required", "detail": str(e)}), 401
    return decorated


def require_role(*role_names):
    """Require user to have one of the specified roles"""
    def decorator(f):
        @functools.wraps(f)
        @require_auth
        def decorated(*args, **kwargs):
            if not g.current_user.role:
                return jsonify({"error": "No role assigned"}), 403
            if g.current_user.role.name not in role_names:
                return jsonify({
                    "error": "Permission denied",
                    "required_roles": list(role_names),
                    "your_role": g.current_user.role.name
                }), 403
            return f(*args, **kwargs)
        return decorated
    return decorator


def require_permission(module: str, action: str):
    """Require a specific module+action permission"""
    def decorator(f):
        @functools.wraps(f)
        @require_auth
        def decorated(*args, **kwargs):
            if not g.current_user.has_permission(module, action):
                return jsonify({
                    "error": "Permission denied",
                    "required": f"{module}:{action}"
                }), 403
            return f(*args, **kwargs)
        return decorated
    return decorator


def audit_log(action: str, entity_type: str = None, entity_label_fn=None):
    """
    Decorator that creates an audit log entry after a successful endpoint call.

    Usage:
        @audit_log("CREATE", "contract")
        def create_contract(): ...
    """
    def decorator(f):
        @functools.wraps(f)
        def decorated(*args, **kwargs):
            old_values = None
            entity_id = kwargs.get("contract_id") or kwargs.get("tender_id") or kwargs.get("id")

            result = f(*args, **kwargs)

            try:
                user = getattr(g, "current_user", None)
                log = AuditLog(
                    user_id=user.id if user else None,
                    user_name=user.name if user else "System",
                    user_emp_id=user.emp_id if user else None,
                    user_role=user.role.name if (user and user.role) else None,
                    action=action,
                    entity_type=entity_type,
                    entity_id=str(entity_id) if entity_id else None,
                    entity_label=entity_label_fn(kwargs) if entity_label_fn else None,
                    old_values=json.dumps(old_values) if old_values else None,
                    ip_address=request.remote_addr,
                    user_agent=request.headers.get("User-Agent", "")[:300],
                    endpoint=request.endpoint,
                    http_method=request.method,
                    success=True,
                )
                db.session.add(log)
                db.session.commit()
            except Exception:
                pass  # Audit log failures should never break business logic

            return result
        return decorated
    return decorator


def get_current_user() -> User:
    """Helper to get current authenticated user"""
    return getattr(g, "current_user", None)
