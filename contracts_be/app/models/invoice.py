"""
Invoice and InvoiceItem Models
"""
import uuid
from datetime import datetime
from ..extensions import db


class Invoice(db.Model):
    __tablename__ = "invoices"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    contract_id = db.Column(db.String(36), db.ForeignKey("contracts.id"), nullable=False)
    vendor_id = db.Column(db.String(36), db.ForeignKey("vendors.id"), nullable=False)

    # Invoice Identity
    invoice_no = db.Column(db.String(100), nullable=False)
    vendor_invoice_no = db.Column(db.String(100))
    bill_type = db.Column(db.String(50))
    # Running Bill, Final Bill, Advance Payment, Mobilization, Secured Advance

    # Financial
    invoice_amount = db.Column(db.Numeric(15, 2), nullable=False)
    gst_amount = db.Column(db.Numeric(15, 2))
    tds_amount = db.Column(db.Numeric(15, 2))
    penalty_deduction = db.Column(db.Numeric(15, 2), default=0)
    retention_amount = db.Column(db.Numeric(15, 2), default=0)
    net_payable = db.Column(db.Numeric(15, 2))

    # Running bill specific
    bill_no = db.Column(db.Integer)
    work_done_percentage = db.Column(db.Numeric(5, 2))
    cumulative_amount = db.Column(db.Numeric(15, 2))

    # Dates
    invoice_date = db.Column(db.Date, nullable=False)
    received_date = db.Column(db.Date)
    due_date = db.Column(db.Date)
    verified_date = db.Column(db.Date)
    sdac_date = db.Column(db.Date)  # SDAC processing date

    # Milestone linkage
    milestone_id = db.Column(db.String(36), db.ForeignKey("contract_milestones.id"))

    # Status Flow
    status = db.Column(db.String(50), default="Submitted")
    # Submitted → Under Verification → SDAC → Finance Approval → Payment Order → Paid → Rejected

    # Verification
    verified_by_id = db.Column(db.String(36), db.ForeignKey("users.id"))
    verification_remarks = db.Column(db.Text)

    # SDAC
    sdac_processed = db.Column(db.Boolean, default=False)
    sdac_processed_by_id = db.Column(db.String(36), db.ForeignKey("users.id"))
    sdac_remarks = db.Column(db.Text)

    # Finance Approval
    finance_approved = db.Column(db.Boolean)
    finance_approved_by_id = db.Column(db.String(36), db.ForeignKey("users.id"))
    finance_approval_date = db.Column(db.DateTime)
    finance_remarks = db.Column(db.Text)

    # Document
    document_id = db.Column(db.String(36), db.ForeignKey("documents.id"))

    created_by_id = db.Column(db.String(36), db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    items = db.relationship("InvoiceItem", backref="invoice", lazy="dynamic")
    payments = db.relationship("Payment", backref="invoice", lazy="dynamic")
    verified_by = db.relationship("User", foreign_keys=[verified_by_id])
    finance_approved_by = db.relationship("User", foreign_keys=[finance_approved_by_id])

    def to_dict(self, include_items=False):
        data = {
            "id": self.id,
            "contract_id": self.contract_id,
            "vendor_id": self.vendor_id,
            "invoice_no": self.invoice_no,
            "vendor_invoice_no": self.vendor_invoice_no,
            "bill_type": self.bill_type,
            "invoice_amount": float(self.invoice_amount),
            "gst_amount": float(self.gst_amount) if self.gst_amount else None,
            "tds_amount": float(self.tds_amount) if self.tds_amount else None,
            "penalty_deduction": float(self.penalty_deduction) if self.penalty_deduction else 0,
            "net_payable": float(self.net_payable) if self.net_payable else None,
            "invoice_date": self.invoice_date.isoformat(),
            "received_date": self.received_date.isoformat() if self.received_date else None,
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "sdac_date": self.sdac_date.isoformat() if self.sdac_date else None,
            "status": self.status,
            "sdac_processed": self.sdac_processed,
            "finance_approved": self.finance_approved,
            "created_at": self.created_at.isoformat(),
            "contract": {
                "name": self.contract.name,
                "contract_no": self.contract.contract_no,
            } if self.contract else None,
            "vendor": {
                "name": self.vendor.name,
            } if self.vendor else None,
        }
        if include_items:
            data["items"] = [i.to_dict() for i in self.items]
        return data


class InvoiceItem(db.Model):
    __tablename__ = "invoice_items"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    invoice_id = db.Column(db.String(36), db.ForeignKey("invoices.id"), nullable=False)

    description = db.Column(db.String(500), nullable=False)
    quantity = db.Column(db.Numeric(10, 3))
    unit = db.Column(db.String(50))
    unit_rate = db.Column(db.Numeric(15, 2))
    amount = db.Column(db.Numeric(15, 2), nullable=False)
    hsn_sac_code = db.Column(db.String(20))
    gst_percentage = db.Column(db.Numeric(5, 2))

    def to_dict(self):
        return {
            "id": self.id,
            "description": self.description,
            "quantity": float(self.quantity) if self.quantity else None,
            "unit": self.unit,
            "unit_rate": float(self.unit_rate) if self.unit_rate else None,
            "amount": float(self.amount),
            "hsn_sac_code": self.hsn_sac_code,
            "gst_percentage": float(self.gst_percentage) if self.gst_percentage else None,
        }
