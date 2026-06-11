"""
Workflow Engine Models — Dynamic, Admin-Configurable
"""
import uuid
from datetime import datetime
from ..extensions import db


class Workflow(db.Model):
    """A workflow definition/instance"""
    __tablename__ = "workflows"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))

    # Template reference
    template_name = db.Column(db.String(100))
    # contract_initiation, tender_approval, bid_evaluation, award_approval,
    # invoice_approval, amendment_approval, renewal_approval

    # Entity reference
    entity_type = db.Column(db.String(50))   # contract, tender, invoice, amendment, etc.
    entity_id = db.Column(db.String(36))

    # State
    status = db.Column(db.String(50), default="Pending")
    # Pending, In Progress, Approved, Rejected, Withdrawn
    current_step = db.Column(db.Integer, default=1)
    total_steps = db.Column(db.Integer)

    # Config (JSON of step definitions)
    steps_config = db.Column(db.Text)  # JSON: [{step, role, approver_id, action}]

    initiated_by_id = db.Column(db.String(36), db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime)

    # Relationships
    steps = db.relationship("WorkflowStep", backref="workflow", lazy="dynamic", cascade="all, delete-orphan")
    approvals = db.relationship("Approval", backref="workflow", lazy="dynamic")

    def to_dict(self):
        import json
        return {
            "id": self.id,
            "template_name": self.template_name,
            "entity_type": self.entity_type,
            "entity_id": self.entity_id,
            "status": self.status,
            "current_step": self.current_step,
            "total_steps": self.total_steps,
            "steps": [s.to_dict() for s in self.steps.order_by(WorkflowStep.step_number)],
            "created_at": self.created_at.isoformat(),
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
        }


class WorkflowStep(db.Model):
    """Individual step in a workflow"""
    __tablename__ = "workflow_steps"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    workflow_id = db.Column(db.String(36), db.ForeignKey("workflows.id"), nullable=False)

    step_number = db.Column(db.Integer, nullable=False)
    step_name = db.Column(db.String(200), nullable=False)
    step_type = db.Column(db.String(50))  # Approval, Review, Information, Parallel

    # Assignee
    assigned_role = db.Column(db.String(100))    # Role name
    assigned_user_id = db.Column(db.String(36), db.ForeignKey("users.id"))

    # Due date
    due_date = db.Column(db.DateTime)
    sla_hours = db.Column(db.Integer, default=48)

    # Status
    status = db.Column(db.String(50), default="Pending")
    # Pending, In Progress, Approved, Rejected, Skipped

    # Comments
    instructions = db.Column(db.Text)
    is_mandatory = db.Column(db.Boolean, default=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime)

    assigned_user = db.relationship("User", foreign_keys=[assigned_user_id])
    approval = db.relationship("Approval", backref="step", uselist=False,
                               primaryjoin="Approval.step_id==WorkflowStep.id",
                               foreign_keys="Approval.step_id")

    def to_dict(self):
        return {
            "id": self.id,
            "step_number": self.step_number,
            "step_name": self.step_name,
            "step_type": self.step_type,
            "assigned_role": self.assigned_role,
            "assigned_user": self.assigned_user.to_dict() if self.assigned_user else None,
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "sla_hours": self.sla_hours,
            "status": self.status,
            "instructions": self.instructions,
            "is_mandatory": self.is_mandatory,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
        }


class Approval(db.Model):
    """Approval action taken on a workflow step"""
    __tablename__ = "approvals"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    workflow_id = db.Column(db.String(36), db.ForeignKey("workflows.id"), nullable=False)
    step_id = db.Column(db.String(36), db.ForeignKey("workflow_steps.id"))

    approver_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    action = db.Column(db.String(50), nullable=False)  # Approved, Rejected, Returned, Forwarded
    comments = db.Column(db.Text)

    # Digital signing
    signed = db.Column(db.Boolean, default=False)
    signature_data = db.Column(db.Text)  # DSC / Aadhaar sign reference

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    approver = db.relationship("User", foreign_keys=[approver_id])

    def to_dict(self):
        return {
            "id": self.id,
            "workflow_id": self.workflow_id,
            "step_id": self.step_id,
            "approver": self.approver.to_dict() if self.approver else None,
            "action": self.action,
            "comments": self.comments,
            "signed": self.signed,
            "created_at": self.created_at.isoformat(),
        }
