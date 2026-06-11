"""
Vendor, VendorDocument, VendorScore Models
"""
import uuid
from datetime import datetime
from ..extensions import db


class Vendor(db.Model):
    __tablename__ = "vendors"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))

    # Basic Info
    name = db.Column(db.String(500), nullable=False)
    short_name = db.Column(db.String(100))
    vendor_code = db.Column(db.String(50), unique=True)

    # Legal
    pan = db.Column(db.String(20))
    gstin = db.Column(db.String(20))
    cin = db.Column(db.String(25))
    registration_no = db.Column(db.String(100))

    # MSME / Startup
    is_msme = db.Column(db.Boolean, default=False)
    msme_certificate_no = db.Column(db.String(100))
    msme_category = db.Column(db.String(20))  # Micro, Small, Medium
    is_startup = db.Column(db.Boolean, default=False)
    startup_certificate_no = db.Column(db.String(100))

    # Contact
    contact_person = db.Column(db.String(200))
    email = db.Column(db.String(200))
    phone = db.Column(db.String(20))
    website = db.Column(db.String(200))

    # Address
    address_line1 = db.Column(db.String(300))
    address_line2 = db.Column(db.String(300))
    city = db.Column(db.String(100))
    state = db.Column(db.String(100))
    pin_code = db.Column(db.String(10))
    country = db.Column(db.String(50), default="India")

    # Bank Details
    bank_name = db.Column(db.String(200))
    bank_account_no = db.Column(db.String(50))
    bank_ifsc = db.Column(db.String(15))
    bank_branch = db.Column(db.String(200))

    # Financial
    annual_turnover = db.Column(db.Numeric(15, 2))
    turnover_year = db.Column(db.String(10))
    net_worth = db.Column(db.Numeric(15, 2))

    # Status
    status = db.Column(db.String(50), default="Active")  # Active, Blacklisted, Suspended
    blacklist_reason = db.Column(db.Text)
    blacklist_date = db.Column(db.Date)

    # Performance Score (0-100)
    performance_score = db.Column(db.Numeric(5, 2), default=0)

    created_by_id = db.Column(db.String(36), db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    documents = db.relationship("VendorDocument", backref="vendor", lazy="dynamic")
    score_history = db.relationship("VendorScore", backref="vendor", lazy="dynamic")
    invoices = db.relationship("Invoice", backref="vendor", lazy="dynamic")

    def to_dict(self, include_score=False):
        data = {
            "id": self.id,
            "name": self.name,
            "short_name": self.short_name,
            "vendor_code": self.vendor_code,
            "pan": self.pan,
            "gstin": self.gstin,
            "is_msme": self.is_msme,
            "msme_category": self.msme_category,
            "is_startup": self.is_startup,
            "contact_person": self.contact_person,
            "email": self.email,
            "phone": self.phone,
            "city": self.city,
            "state": self.state,
            "annual_turnover": float(self.annual_turnover) if self.annual_turnover else None,
            "performance_score": float(self.performance_score) if self.performance_score else 0,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
        }
        if include_score:
            data["score_history"] = [s.to_dict() for s in self.score_history.order_by(VendorScore.created_at.desc()).limit(5)]
        return data

    def __repr__(self):
        return f"<Vendor {self.vendor_code} - {self.name[:50]}>"


class VendorDocument(db.Model):
    __tablename__ = "vendor_documents"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    vendor_id = db.Column(db.String(36), db.ForeignKey("vendors.id"), nullable=False)

    doc_type = db.Column(db.String(100))  # PAN, GSTIN, MSME, Startup, Registration, etc.
    filename = db.Column(db.String(500), nullable=False)
    storage_path = db.Column(db.String(1000))
    expiry_date = db.Column(db.Date)

    uploaded_by_id = db.Column(db.String(36), db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class VendorScore(db.Model):
    __tablename__ = "vendor_scores"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    vendor_id = db.Column(db.String(36), db.ForeignKey("vendors.id"), nullable=False)
    contract_id = db.Column(db.String(36), db.ForeignKey("contracts.id"))

    # Scoring criteria (0-10 each)
    quality_score = db.Column(db.Numeric(4, 2), default=0)
    timeliness_score = db.Column(db.Numeric(4, 2), default=0)
    compliance_score = db.Column(db.Numeric(4, 2), default=0)
    communication_score = db.Column(db.Numeric(4, 2), default=0)
    overall_score = db.Column(db.Numeric(5, 2), default=0)

    comments = db.Column(db.Text)
    evaluated_by_id = db.Column(db.String(36), db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Penalty stats
    penalty_count = db.Column(db.Integer, default=0)
    total_penalty_amount = db.Column(db.Numeric(15, 2), default=0)
    delays_count = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "contract_id": self.contract_id,
            "quality_score": float(self.quality_score),
            "timeliness_score": float(self.timeliness_score),
            "compliance_score": float(self.compliance_score),
            "communication_score": float(self.communication_score),
            "overall_score": float(self.overall_score),
            "comments": self.comments,
            "penalty_count": self.penalty_count,
            "created_at": self.created_at.isoformat(),
        }
