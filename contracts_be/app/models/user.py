"""
User, Role, Permission Models
"""
import uuid
from datetime import datetime
from ..extensions import db


class Permission(db.Model):
    __tablename__ = "permissions"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), unique=True, nullable=False)
    module = db.Column(db.String(50), nullable=False)  # contracts, tenders, invoices etc.
    action = db.Column(db.String(50), nullable=False)  # create, read, update, delete, approve
    description = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "module": self.module,
            "action": self.action,
            "description": self.description,
        }


class RolePermission(db.Model):
    __tablename__ = "role_permissions"

    role_id = db.Column(db.String(36), db.ForeignKey("roles.id"), primary_key=True)
    permission_id = db.Column(db.String(36), db.ForeignKey("permissions.id"), primary_key=True)
    granted_at = db.Column(db.DateTime, default=datetime.utcnow)


class Role(db.Model):
    __tablename__ = "roles"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), unique=True, nullable=False)
    display_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500))
    is_system = db.Column(db.Boolean, default=False)  # System roles can't be deleted
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    permissions = db.relationship(
        "Permission",
        secondary="role_permissions",
        backref=db.backref("roles", lazy="dynamic"),
        lazy="dynamic"
    )
    users = db.relationship("User", backref="role", lazy="dynamic")

    def has_permission(self, module: str, action: str) -> bool:
        return self.permissions.filter_by(module=module, action=action).first() is not None

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "display_name": self.display_name,
            "description": self.description,
            "is_system": self.is_system,
            "permissions": [p.to_dict() for p in self.permissions],
        }


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    emp_id = db.Column(db.String(20), unique=True, nullable=False)  # ERLDC Employee ID
    username = db.Column(db.String(100), unique=True, nullable=False)
    name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(200))
    mobile = db.Column(db.String(20))
    department = db.Column(db.String(100))
    designation = db.Column(db.String(100))
    region = db.Column(db.String(50))  # NRLDC, SRLDC, WRLDC, ERLDC, NERLDC, HQ

    # Auth
    role_id = db.Column(db.String(36), db.ForeignKey("roles.id"))
    is_active = db.Column(db.Boolean, default=True)
    last_login = db.Column(db.DateTime)

    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    notifications = db.relationship("Notification", backref="user", lazy="dynamic")
    audit_logs = db.relationship("AuditLog", backref="user", lazy="dynamic")

    def has_permission(self, module: str, action: str) -> bool:
        if self.role:
            return self.role.has_permission(module, action)
        return False

    def to_dict(self, include_role=False):
        data = {
            "id": self.id,
            "emp_id": self.emp_id,
            "username": self.username,
            "name": self.name,
            "email": self.email,
            "mobile": self.mobile,
            "department": self.department,
            "designation": self.designation,
            "region": self.region,
            "is_active": self.is_active,
            "last_login": self.last_login.isoformat() if self.last_login else None,
            "created_at": self.created_at.isoformat(),
        }
        if include_role and self.role:
            data["role"] = self.role.to_dict()
        elif self.role:
            data["role"] = {"id": self.role.id, "name": self.role.name, "display_name": self.role.display_name}
        return data

    def __repr__(self):
        return f"<User {self.emp_id} - {self.name}>"
