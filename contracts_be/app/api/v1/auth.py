"""
Authentication API — SSO integration + JWT token issuance
"""
import requests
from datetime import datetime
from flask import request, jsonify, current_app
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity
)

from . import api_v1_bp
from ...extensions import db
from ...models.user import User, Role
from ...models.audit import AuditLog


def _map_sso_department(sso_dept: str) -> str:
    """Map SSO department codes to full names"""
    if not sso_dept:
        return ""
    dept = sso_dept.strip()
    if dept in ["Information Technology (IT)", "Information Technology", "IT", "IT-TS"]:
        return "Information Technology"
        
    dept_map = {
        "IT": "Information Technology",
        "IT-TS": "Information Technology",
        "MO": "Market Operation",
        "MO-I": "Market Operation",
        "MO-II": "Market Operation",
        "MO-III": "Market Operation",
        "MO-IV": "Market Operation",
        "SO": "System Operation",
        "SS": "System Operation",
        "MIS": "System Operation",
        "CR": "System Operation",
        "SCADA": "SCADA",
        "CS": "Contracts & Services",
        "TS": "Technical Services",
        "HR": "Human Resource",
        "COMMUNICATION": "Communication",
        "F&A": "Finance & Accounts",
    }
    return dept_map.get(dept, dept)


def _determine_role(sso_dept: str, user: User) -> str:
    """Determine CLM role from SSO department"""
    if not sso_dept:
        return "initiator"
    dept = sso_dept.strip()
    if dept in ["Information Technology (IT)", "Information Technology", "IT", "IT-TS"]:
        return "admin"
        
    role_map = {
        "CS": "purchase",        # Contracts & Services → Purchase role
        "F&A": "finance",
        "IT": "admin",
        "IT-TS": "admin",
    }
    # Default: department users get initiator role
    return role_map.get(dept, "initiator")


@api_v1_bp.route("/auth/sso-login", methods=["POST"])
def sso_login():
    """
    Verify SSO token from external SSO system and issue CLM JWT.
    Body: { "sso_token": "<token_from_sso>" }
    """
    data = request.get_json()
    if not data or "sso_token" not in data:
        return jsonify({"error": "sso_token required"}), 400

    sso_token = data["sso_token"]
    decoded = None

    # First attempt: Try to decode sso_token directly (in case the final token is passed directly)
    try:
        import jwt as pyjwt
        decoded_direct = pyjwt.decode(sso_token, options={"verify_signature": False})
        if decoded_direct and decoded_direct.get("User") and decoded_direct.get("Login"):
            decoded = decoded_direct
    except Exception:
        pass

    # Second attempt: Fall back to external SSO verification endpoint
    if not decoded:
        try:
            sso_resp = requests.get(
                current_app.config["SSO_VERIFY_URL"],
                headers={"Token": sso_token},
                timeout=10,
                verify=False
            )
            sso_data = sso_resp.json()
        except Exception as e:
            return jsonify({"error": "SSO verification failed", "detail": str(e)}), 503

        if sso_data == "User has logout" or sso_data == "Bad Token":
            return jsonify({"error": "Invalid SSO session"}), 401

        # Decode the SSO final token
        try:
            import jwt as pyjwt
            final_token = sso_data.get("Final_Token", "")
            decoded = pyjwt.decode(final_token, options={"verify_signature": False})
        except Exception:
            return jsonify({"error": "Failed to decode SSO token"}), 401

    if not decoded.get("Login"):
        return jsonify({"error": "SSO login invalid", "reason": decoded.get("Reason")}), 401

    emp_id = decoded.get("User")
    person_name = decoded.get("Person_Name")
    sso_dept = decoded.get("Department", "")
    email = decoded.get("Email")

    # Find or create user in CLM DB
    user = User.query.filter_by(emp_id=emp_id).first()
    dept_name = _map_sso_department(sso_dept)
    role_name = _determine_role(sso_dept, user)
    role = Role.query.filter_by(name=role_name).first()

    if not user:
        # Auto-provision user
        user = User(
            emp_id=emp_id,
            username=emp_id,
            name=person_name,
            department=dept_name,
            role_id=role.id if role else None,
            email=email,
        )
        db.session.add(user)
    else:
        user.department = dept_name
        if email:
            user.email = email
        if role:
            user.role_id = role.id

    user.last_login = datetime.utcnow()
    db.session.commit()

    # Issue CLM JWT
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)

    # Audit log
    log = AuditLog(
        user_id=user.id,
        user_name=user.name,
        user_emp_id=user.emp_id,
        user_role=user.role.name if user.role else None,
        action="LOGIN",
        entity_type="user",
        entity_id=user.id,
        ip_address=request.remote_addr,
        endpoint="/api/v1/auth/sso-login",
        http_method="POST",
        success=True,
    )
    db.session.add(log)
    db.session.commit()

    return jsonify({
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": user.to_dict(include_role=True),
        "expires_in": current_app.config["JWT_ACCESS_TOKEN_EXPIRES"].total_seconds(),
    })


@api_v1_bp.route("/auth/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh_token():
    """Issue new access token using refresh token"""
    user_id = get_jwt_identity()
    user = User.query.filter_by(id=user_id, is_active=True).first()
    if not user:
        return jsonify({"error": "User not found"}), 401
    access_token = create_access_token(identity=user.id)
    return jsonify({"access_token": access_token})


@api_v1_bp.route("/auth/me", methods=["GET"])
@jwt_required()
def get_me():
    """Get current user profile"""
    user_id = get_jwt_identity()
    user = User.query.filter_by(id=user_id, is_active=True).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.to_dict(include_role=True))


@api_v1_bp.route("/auth/dev-login", methods=["POST"])
def dev_login():
    """Development login endpoint to bypass SSO verification"""
    data = request.get_json() or {}
    emp_id = data.get("emp_id", "00001")
    
    user = User.query.filter_by(emp_id=emp_id).first()
    if not user:
        user = User.query.filter_by(username=emp_id).first()
        
    if not user:
        # Auto-provision user if not exists
        role = Role.query.filter_by(name="admin").first()
        user = User(
            emp_id=emp_id,
            username=emp_id,
            name=f"Dev User {emp_id}",
            department="Information Technology",
            role_id=role.id if role else None,
            is_active=True
        )
        db.session.add(user)
        db.session.commit()
        
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)
    
    return jsonify({
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": user.to_dict(include_role=True),
        "expires_in": current_app.config["JWT_ACCESS_TOKEN_EXPIRES"].total_seconds(),
    })

