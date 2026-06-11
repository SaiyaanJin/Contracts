"""
SLA Matrix and SLA Breach Models
"""
import uuid
from datetime import datetime
from ..extensions import db


class SLAMatrix(db.Model):
    __tablename__ = "sla_matrix"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    contract_id = db.Column(db.String(36), db.ForeignKey("contracts.id"), nullable=False)

    # SLA Definition
    metric_name = db.Column(db.String(200), nullable=False)
    metric_type = db.Column(db.String(50))
    # Response Time, Resolution Time, Uptime, Delivery, Reporting, Availability

    # Threshold
    threshold_value = db.Column(db.Numeric(10, 2))
    threshold_unit = db.Column(db.String(20))  # Hours, Days, Percentage
    measurement_period = db.Column(db.String(50))  # Daily, Weekly, Monthly

    # Penalty
    penalty_type = db.Column(db.String(50))  # Percentage, Fixed Amount
    penalty_rate = db.Column(db.Numeric(8, 4))  # Percentage per breach or fixed amount
    max_penalty_cap = db.Column(db.Numeric(15, 2))

    # Escalation
    escalation_level1_id = db.Column(db.String(36), db.ForeignKey("users.id"))
    escalation_level2_id = db.Column(db.String(36), db.ForeignKey("users.id"))
    escalation_level3_id = db.Column(db.String(36), db.ForeignKey("users.id"))
    escalation_hours = db.Column(db.Integer, default=24)  # Hours before escalation

    is_active = db.Column(db.Boolean, default=True)
    created_by_id = db.Column(db.String(36), db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    breaches = db.relationship("SLABreach", backref="sla", lazy="dynamic")

    def to_dict(self):
        return {
            "id": self.id,
            "contract_id": self.contract_id,
            "metric_name": self.metric_name,
            "metric_type": self.metric_type,
            "threshold_value": float(self.threshold_value) if self.threshold_value else None,
            "threshold_unit": self.threshold_unit,
            "measurement_period": self.measurement_period,
            "penalty_type": self.penalty_type,
            "penalty_rate": float(self.penalty_rate) if self.penalty_rate else None,
            "max_penalty_cap": float(self.max_penalty_cap) if self.max_penalty_cap else None,
            "escalation_hours": self.escalation_hours,
            "is_active": self.is_active,
            "breach_count": self.breaches.count(),
        }


class SLABreach(db.Model):
    __tablename__ = "sla_breaches"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    sla_id = db.Column(db.String(36), db.ForeignKey("sla_matrix.id"), nullable=False)
    contract_id = db.Column(db.String(36), db.ForeignKey("contracts.id"))

    breach_date = db.Column(db.DateTime, nullable=False)
    breach_description = db.Column(db.Text)
    actual_value = db.Column(db.Numeric(10, 2))  # Actual measured value
    threshold_value = db.Column(db.Numeric(10, 2))  # Threshold at time of breach

    # Resolution
    resolved_date = db.Column(db.DateTime)
    resolution_notes = db.Column(db.Text)

    # Penalty
    penalty_amount = db.Column(db.Numeric(15, 2))
    penalty_applied = db.Column(db.Boolean, default=False)
    penalty_invoice_id = db.Column(db.String(36), db.ForeignKey("invoices.id"))

    # Escalation
    escalation_level = db.Column(db.Integer, default=0)
    escalated_at = db.Column(db.DateTime)
    escalated_to_id = db.Column(db.String(36), db.ForeignKey("users.id"))

    status = db.Column(db.String(50), default="Open")  # Open, Resolved, Disputed, Closed

    reported_by_id = db.Column(db.String(36), db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "sla_id": self.sla_id,
            "contract_id": self.contract_id,
            "breach_date": self.breach_date.isoformat(),
            "breach_description": self.breach_description,
            "actual_value": float(self.actual_value) if self.actual_value else None,
            "threshold_value": float(self.threshold_value) if self.threshold_value else None,
            "resolved_date": self.resolved_date.isoformat() if self.resolved_date else None,
            "penalty_amount": float(self.penalty_amount) if self.penalty_amount else None,
            "penalty_applied": self.penalty_applied,
            "escalation_level": self.escalation_level,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
        }
