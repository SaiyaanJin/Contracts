"""
Contract, ContractAmendment, ContractRenewal, ContractMilestone Models
"""
import uuid
from datetime import datetime
from ..extensions import db


class Contract(db.Model):
    __tablename__ = "contracts"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))

    # Identification
    contract_no = db.Column(db.String(100), unique=True, nullable=False)
    file_no = db.Column(db.String(100))
    initiation_no = db.Column(db.String(100))
    gem_contract_no = db.Column(db.String(100))  # GeM Contract ID

    # Basic Details
    name = db.Column(db.String(500), nullable=False)
    short_description = db.Column(db.Text)
    scope_of_work = db.Column(db.Text)
    deliverables = db.Column(db.Text)
    risks = db.Column(db.Text)

    # Organization
    department = db.Column(db.String(100), nullable=False)
    region = db.Column(db.String(50))  # NRLDC, SRLDC, WRLDC, ERLDC, NERLDC, HQ
    project = db.Column(db.String(200))
    budget_head = db.Column(db.String(200))
    funding_source = db.Column(db.String(200))

    # Type Classification
    contract_type = db.Column(db.String(50))      # Supply, Service, Supply+Service, Subscription
    procurement_type = db.Column(db.String(100))  # GeM, E-Procurement, Offline, Others
    category = db.Column(db.String(100))          # IT, Civil, Electrical, etc.

    # Financial
    estimated_value = db.Column(db.Numeric(15, 2))
    contract_value = db.Column(db.Numeric(15, 2))
    currency = db.Column(db.String(5), default="INR")
    gst_applicable = db.Column(db.Boolean, default=True)
    gst_percentage = db.Column(db.Numeric(5, 2), default=18.00)

    # Vendor
    vendor_id = db.Column(db.String(36), db.ForeignKey("vendors.id"))

    # Dates
    award_date = db.Column(db.Date)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date, nullable=False)
    loa_date = db.Column(db.Date)

    # Contract Period
    contract_period_value = db.Column(db.Integer)
    contract_period_unit = db.Column(db.String(10))  # Days, Months, Years

    # Security & BG
    sd_bg_required = db.Column(db.Boolean, default=False)
    sd_bg_amount = db.Column(db.Numeric(15, 2))
    sd_bg_file_no = db.Column(db.String(100))
    bg_expiry_date = db.Column(db.Date)

    # Warranty / Maintenance
    warranty_period_value = db.Column(db.Integer)
    warranty_period_unit = db.Column(db.String(10))
    maintenance_period_value = db.Column(db.Integer)
    maintenance_period_unit = db.Column(db.String(10))

    # Supply Specific
    supply_end_date = db.Column(db.Date)
    installation_end_date = db.Column(db.Date)
    toc_date = db.Column(db.Date)

    # Service Specific
    service_start_date = db.Column(db.Date)
    service_period_value = db.Column(db.Integer)
    service_period_unit = db.Column(db.String(10))

    # Subscription Specific
    subscription_start_date = db.Column(db.Date)
    subscription_end_date = db.Column(db.Date)

    # Contract Manager
    eic = db.Column(db.String(200))  # Engineer In Charge
    contract_manager_id = db.Column(db.String(36), db.ForeignKey("users.id"))

    # Status & Lifecycle
    status = db.Column(db.String(50), default="Draft")
    # Draft, Active, Expiring Soon, Expired, Terminated, Completed, Under Amendment
    lifecycle_stage = db.Column(db.String(50), default="Initiation")
    # Initiation, Procurement, Award, Execution, Closure

    # Renewal tracking
    renewal_alert_90_sent = db.Column(db.Boolean, default=False)
    renewal_alert_60_sent = db.Column(db.Boolean, default=False)
    renewal_alert_30_sent = db.Column(db.Boolean, default=False)
    renewal_alert_180_sent = db.Column(db.Boolean, default=False)

    # Email flags (legacy compat)
    expired_mail_sent = db.Column(db.String(50), default="No")

    # Justification
    justification = db.Column(db.Text)

    # Audit
    created_by_id = db.Column(db.String(36), db.ForeignKey("users.id"))
    updated_by_id = db.Column(db.String(36), db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    vendor = db.relationship("Vendor", backref="contracts", foreign_keys=[vendor_id])
    contract_manager = db.relationship("User", foreign_keys=[contract_manager_id])
    created_by = db.relationship("User", foreign_keys=[created_by_id])
    amendments = db.relationship("ContractAmendment", backref="contract", lazy="dynamic")
    renewals = db.relationship("ContractRenewal", backref="contract", lazy="dynamic")
    milestones = db.relationship("ContractMilestone", backref="contract", lazy="dynamic")
    obligations = db.relationship("ContractObligation", backref="contract", lazy="dynamic", cascade="all, delete-orphan")
    invoices = db.relationship("Invoice", backref="contract", lazy="dynamic")
    sla_matrix = db.relationship("SLAMatrix", backref="contract", lazy="dynamic")
    documents = db.relationship(
        "Document",
        primaryjoin="and_(Document.ref_id==Contract.id, Document.ref_type=='contract')",
        foreign_keys="Document.ref_id",
        lazy="dynamic"
    )
    note_sheets = db.relationship("NoteSheet", backref="contract", lazy="dynamic")

    def days_to_expiry(self):
        if self.end_date:
            delta = self.end_date - datetime.utcnow().date()
            return delta.days
        return None

    def computed_status(self):
        days = self.days_to_expiry()
        if self.status in ["Terminated", "Completed"]:
            return self.status
        if days is None:
            return "Unknown"
        if days < 0:
            return "Expired"
        if days <= 30:
            return "Expiring Soon"
        if days <= 90:
            return "Expiring in 90 Days"
        return "Active"

    def to_dict(self, include_relations=False):
        data = {
            "id": self.id,
            "contract_no": self.contract_no,
            "file_no": self.file_no,
            "gem_contract_no": self.gem_contract_no,
            "name": self.name,
            "short_description": self.short_description,
            "department": self.department,
            "region": self.region,
            "project": self.project,
            "budget_head": self.budget_head,
            "contract_type": self.contract_type,
            "procurement_type": self.procurement_type,
            "category": self.category,
            "estimated_value": float(self.estimated_value) if self.estimated_value else None,
            "contract_value": float(self.contract_value) if self.contract_value else None,
            "currency": self.currency,
            "award_date": self.award_date.isoformat() if self.award_date else None,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "contract_period_value": self.contract_period_value,
            "contract_period_unit": self.contract_period_unit,
            "eic": self.eic,
            "status": self.computed_status(),
            "lifecycle_stage": self.lifecycle_stage,
            "days_to_expiry": self.days_to_expiry(),
            "sd_bg_required": self.sd_bg_required,
            "sd_bg_amount": float(self.sd_bg_amount) if self.sd_bg_amount else None,
            "bg_expiry_date": self.bg_expiry_date.isoformat() if self.bg_expiry_date else None,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
        if include_relations:
            data["vendor"] = self.vendor.to_dict() if self.vendor else None
            data["amendments_count"] = self.amendments.count()
            data["invoices_count"] = self.invoices.count()
            data["milestones_count"] = self.milestones.count()
        return data

    def __repr__(self):
        return f"<Contract {self.contract_no} - {self.name[:50]}>"


class ContractAmendment(db.Model):
    __tablename__ = "contract_amendments"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    contract_id = db.Column(db.String(36), db.ForeignKey("contracts.id"), nullable=False)
    amendment_no = db.Column(db.String(50), nullable=False)

    # Amendment Type
    amendment_type = db.Column(db.String(50))  # Scope, Value, Time Extension, Additional Work
    description = db.Column(db.Text, nullable=False)
    justification = db.Column(db.Text)

    # Changes
    old_value = db.Column(db.Text)  # JSON-serialized old values
    new_value = db.Column(db.Text)  # JSON-serialized new values
    value_change = db.Column(db.Numeric(15, 2))  # Net value change
    time_extension_days = db.Column(db.Integer)
    new_end_date = db.Column(db.Date)

    # Approval
    status = db.Column(db.String(50), default="Pending")
    approved_by_id = db.Column(db.String(36), db.ForeignKey("users.id"))
    approved_at = db.Column(db.DateTime)
    approval_comments = db.Column(db.Text)

    # Workflow
    workflow_id = db.Column(db.String(36), db.ForeignKey("workflows.id"))

    created_by_id = db.Column(db.String(36), db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    approved_by = db.relationship("User", foreign_keys=[approved_by_id])
    created_by = db.relationship("User", foreign_keys=[created_by_id])

    def to_dict(self):
        return {
            "id": self.id,
            "contract_id": self.contract_id,
            "amendment_no": self.amendment_no,
            "amendment_type": self.amendment_type,
            "description": self.description,
            "justification": self.justification,
            "value_change": float(self.value_change) if self.value_change else None,
            "time_extension_days": self.time_extension_days,
            "new_end_date": self.new_end_date.isoformat() if self.new_end_date else None,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
        }


class ContractRenewal(db.Model):
    __tablename__ = "contract_renewals"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    contract_id = db.Column(db.String(36), db.ForeignKey("contracts.id"), nullable=False)
    renewal_no = db.Column(db.String(50))

    renewal_period_value = db.Column(db.Integer)
    renewal_period_unit = db.Column(db.String(10))
    new_end_date = db.Column(db.Date)
    new_value = db.Column(db.Numeric(15, 2))

    status = db.Column(db.String(50), default="Initiated")
    workflow_id = db.Column(db.String(36), db.ForeignKey("workflows.id"))

    initiated_by_id = db.Column(db.String(36), db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "contract_id": self.contract_id,
            "renewal_no": self.renewal_no,
            "renewal_period_value": self.renewal_period_value,
            "renewal_period_unit": self.renewal_period_unit,
            "new_end_date": self.new_end_date.isoformat() if self.new_end_date else None,
            "new_value": float(self.new_value) if self.new_value else None,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
        }


class ContractMilestone(db.Model):
    __tablename__ = "contract_milestones"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    contract_id = db.Column(db.String(36), db.ForeignKey("contracts.id"), nullable=False)

    title = db.Column(db.String(300), nullable=False)
    description = db.Column(db.Text)
    planned_date = db.Column(db.Date, nullable=False)
    actual_date = db.Column(db.Date)
    completion_percentage = db.Column(db.Integer, default=0)
    status = db.Column(db.String(50), default="Pending")  # Pending, In Progress, Completed, Delayed
    milestone_type = db.Column(db.String(50))  # Delivery, Payment, Review, Site Visit

    linked_payment_amount = db.Column(db.Numeric(15, 2))

    created_by_id = db.Column(db.String(36), db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "contract_id": self.contract_id,
            "title": self.title,
            "description": self.description,
            "planned_date": self.planned_date.isoformat(),
            "actual_date": self.actual_date.isoformat() if self.actual_date else None,
            "completion_percentage": self.completion_percentage,
            "status": self.status,
            "milestone_type": self.milestone_type,
            "linked_payment_amount": float(self.linked_payment_amount) if self.linked_payment_amount else None,
        }


class ContractObligation(db.Model):
    __tablename__ = "contract_obligations"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    contract_id = db.Column(db.String(36), db.ForeignKey("contracts.id"), nullable=False)

    title = db.Column(db.String(300), nullable=False)
    description = db.Column(db.Text)
    due_date = db.Column(db.Date, nullable=False)
    completed_date = db.Column(db.Date)
    status = db.Column(db.String(50), default="Pending")  # Pending, Submitted, Approved, Overdue
    obligation_type = db.Column(db.String(50))  # Statutory, Insurance, Safety, Labor, Other
    remarks = db.Column(db.Text)

    created_by_id = db.Column(db.String(36), db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    created_by = db.relationship("User", foreign_keys=[created_by_id])

    def to_dict(self):
        return {
            "id": self.id,
            "contract_id": self.contract_id,
            "title": self.title,
            "description": self.description,
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "completed_date": self.completed_date.isoformat() if self.completed_date else None,
            "status": self.status,
            "obligation_type": self.obligation_type,
            "remarks": self.remarks,
        }
