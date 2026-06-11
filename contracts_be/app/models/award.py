"""
Award, LOA, PurchaseOrder Models
"""
import uuid
from datetime import datetime
from ..extensions import db


class Award(db.Model):
    __tablename__ = "awards"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    tender_id = db.Column(db.String(36), db.ForeignKey("tenders.id"), nullable=False)
    vendor_id = db.Column(db.String(36), db.ForeignKey("vendors.id"), nullable=False)
    contract_id = db.Column(db.String(36), db.ForeignKey("contracts.id"))

    awarded_amount = db.Column(db.Numeric(15, 2), nullable=False)
    award_date = db.Column(db.Date, nullable=False)
    award_basis = db.Column(db.String(100))  # L1, Negotiated, Single Source

    status = db.Column(db.String(50), default="Pending")  # Pending, LOA Issued, PO Issued, Accepted, Rejected
    workflow_id = db.Column(db.String(36), db.ForeignKey("workflows.id"))

    approved_by_id = db.Column(db.String(36), db.ForeignKey("users.id"))
    created_by_id = db.Column(db.String(36), db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    vendor = db.relationship("Vendor")
    loa = db.relationship("LOA", backref="award", uselist=False)
    purchase_order = db.relationship("PurchaseOrder", backref="award", uselist=False)

    def to_dict(self):
        return {
            "id": self.id,
            "tender_id": self.tender_id,
            "vendor_id": self.vendor_id,
            "vendor_name": self.vendor.name if self.vendor else None,
            "awarded_amount": float(self.awarded_amount),
            "award_date": self.award_date.isoformat(),
            "award_basis": self.award_basis,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
        }


class LOA(db.Model):
    """Letter of Award"""
    __tablename__ = "loas"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    award_id = db.Column(db.String(36), db.ForeignKey("awards.id"), nullable=False)

    loa_no = db.Column(db.String(100), unique=True, nullable=False)
    loa_date = db.Column(db.Date, nullable=False)
    acceptance_deadline = db.Column(db.Date)

    content = db.Column(db.Text)  # Full LOA content
    document_id = db.Column(db.String(36), db.ForeignKey("documents.id"))

    # Acceptance
    accepted_by_vendor = db.Column(db.Boolean)
    acceptance_date = db.Column(db.Date)
    acceptance_document_id = db.Column(db.String(36), db.ForeignKey("documents.id"))

    # Digital signature
    signed = db.Column(db.Boolean, default=False)
    signed_by_id = db.Column(db.String(36), db.ForeignKey("users.id"))
    signed_at = db.Column(db.DateTime)

    status = db.Column(db.String(50), default="Draft")

    created_by_id = db.Column(db.String(36), db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "award_id": self.award_id,
            "loa_no": self.loa_no,
            "loa_date": self.loa_date.isoformat(),
            "acceptance_deadline": self.acceptance_deadline.isoformat() if self.acceptance_deadline else None,
            "accepted_by_vendor": self.accepted_by_vendor,
            "acceptance_date": self.acceptance_date.isoformat() if self.acceptance_date else None,
            "signed": self.signed,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
        }


class PurchaseOrder(db.Model):
    __tablename__ = "purchase_orders"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    award_id = db.Column(db.String(36), db.ForeignKey("awards.id"), nullable=False)

    po_no = db.Column(db.String(100), unique=True, nullable=False)
    po_type = db.Column(db.String(50))  # Purchase Order, Work Order, Service Order
    po_date = db.Column(db.Date, nullable=False)
    delivery_period_days = db.Column(db.Integer)
    delivery_location = db.Column(db.String(300))

    # Financial
    po_amount = db.Column(db.Numeric(15, 2), nullable=False)
    gst_amount = db.Column(db.Numeric(15, 2))
    total_amount = db.Column(db.Numeric(15, 2))

    content = db.Column(db.Text)  # Full PO content
    document_id = db.Column(db.String(36), db.ForeignKey("documents.id"))

    signed = db.Column(db.Boolean, default=False)
    signed_by_id = db.Column(db.String(36), db.ForeignKey("users.id"))
    signed_at = db.Column(db.DateTime)

    status = db.Column(db.String(50), default="Draft")

    created_by_id = db.Column(db.String(36), db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "award_id": self.award_id,
            "po_no": self.po_no,
            "po_type": self.po_type,
            "po_date": self.po_date.isoformat(),
            "po_amount": float(self.po_amount),
            "gst_amount": float(self.gst_amount) if self.gst_amount else None,
            "total_amount": float(self.total_amount) if self.total_amount else None,
            "delivery_period_days": self.delivery_period_days,
            "signed": self.signed,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
        }
