"""
Notification and NotificationTemplate Models
"""
import uuid
from datetime import datetime
from ..extensions import db


class NotificationTemplate(db.Model):
    """Reusable templates for notifications"""
    __tablename__ = "notification_templates"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), unique=True, nullable=False)
    event_type = db.Column(db.String(100))
    # contract_expiry, contract_renewal, sla_breach, invoice_due,
    # approval_pending, award_issued, bid_opened, etc.

    channel = db.Column(db.String(50), default="email")  # email, sms, whatsapp, in_app

    subject = db.Column(db.String(300))
    body_template = db.Column(db.Text)  # Jinja2 template
    is_active = db.Column(db.Boolean, default=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Notification(db.Model):
    """Individual notification sent/pending"""
    __tablename__ = "notifications"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)

    # Classification
    notification_type = db.Column(db.String(100))
    # contract_expiry, approval_required, invoice_submitted, sla_breach, etc.
    channel = db.Column(db.String(50), default="in_app")

    # Content
    title = db.Column(db.String(300), nullable=False)
    message = db.Column(db.Text, nullable=False)

    # Entity link
    entity_type = db.Column(db.String(50))  # contract, tender, invoice, etc.
    entity_id = db.Column(db.String(36))

    # Status
    is_read = db.Column(db.Boolean, default=False)
    read_at = db.Column(db.DateTime)

    # Email / SMS delivery
    delivered = db.Column(db.Boolean, default=False)
    delivered_at = db.Column(db.DateTime)
    delivery_error = db.Column(db.Text)

    # Priority
    priority = db.Column(db.String(20), default="Normal")  # Low, Normal, High, Critical

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "notification_type": self.notification_type,
            "channel": self.channel,
            "title": self.title,
            "message": self.message,
            "entity_type": self.entity_type,
            "entity_id": self.entity_id,
            "is_read": self.is_read,
            "read_at": self.read_at.isoformat() if self.read_at else None,
            "priority": self.priority,
            "created_at": self.created_at.isoformat(),
        }
