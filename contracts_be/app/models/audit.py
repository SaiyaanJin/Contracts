"""
Audit Log Model — Tamper-Proof Activity Trail
"""
import uuid
from datetime import datetime
from ..extensions import db


class AuditLog(db.Model):
    __tablename__ = "audit_logs"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))

    # Who
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"))
    user_name = db.Column(db.String(200))  # Denormalized for historical accuracy
    user_emp_id = db.Column(db.String(20))
    user_role = db.Column(db.String(100))

    # What
    action = db.Column(db.String(100), nullable=False)
    # CREATE, UPDATE, DELETE, VIEW, APPROVE, REJECT, UPLOAD, DOWNLOAD, LOGIN, LOGOUT

    entity_type = db.Column(db.String(50))   # contract, tender, invoice, user, etc.
    entity_id = db.Column(db.String(36))
    entity_label = db.Column(db.String(200)) # Human-readable label

    # Changes
    old_values = db.Column(db.Text)   # JSON
    new_values = db.Column(db.Text)   # JSON
    changed_fields = db.Column(db.Text)  # JSON array of field names

    # Context
    ip_address = db.Column(db.String(50))
    user_agent = db.Column(db.String(300))
    endpoint = db.Column(db.String(200))
    http_method = db.Column(db.String(10))

    # Result
    success = db.Column(db.Boolean, default=True)
    error_message = db.Column(db.Text)

    # Immutable timestamp
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Index for fast queries
    __table_args__ = (
        db.Index("idx_audit_user", "user_id"),
        db.Index("idx_audit_entity", "entity_type", "entity_id"),
        db.Index("idx_audit_action", "action"),
        db.Index("idx_audit_created", "created_at"),
    )

    def to_dict(self):
        import json
        return {
            "id": self.id,
            "user_name": self.user_name,
            "user_emp_id": self.user_emp_id,
            "user_role": self.user_role,
            "action": self.action,
            "entity_type": self.entity_type,
            "entity_id": self.entity_id,
            "entity_label": self.entity_label,
            "old_values": json.loads(self.old_values) if self.old_values else None,
            "new_values": json.loads(self.new_values) if self.new_values else None,
            "changed_fields": json.loads(self.changed_fields) if self.changed_fields else [],
            "ip_address": self.ip_address,
            "endpoint": self.endpoint,
            "success": self.success,
            "created_at": self.created_at.isoformat(),
        }
