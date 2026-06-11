"""
Payment Model
"""
import uuid
from datetime import datetime
from ..extensions import db


class Payment(db.Model):
    __tablename__ = "payments"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    invoice_id = db.Column(db.String(36), db.ForeignKey("invoices.id"), nullable=False)
    contract_id = db.Column(db.String(36), db.ForeignKey("contracts.id"))
    vendor_id = db.Column(db.String(36), db.ForeignKey("vendors.id"))

    payment_order_no = db.Column(db.String(100))
    payment_amount = db.Column(db.Numeric(15, 2), nullable=False)
    payment_mode = db.Column(db.String(50))  # RTGS, NEFT, Cheque, DD

    # Bank details at time of payment
    bank_name = db.Column(db.String(200))
    bank_account_no = db.Column(db.String(50))
    bank_ifsc = db.Column(db.String(15))
    utr_no = db.Column(db.String(50))  # UTR / Transaction reference

    payment_date = db.Column(db.Date)
    value_date = db.Column(db.Date)

    status = db.Column(db.String(50), default="Pending")
    # Pending, Payment Order Issued, Paid, Failed, Reversed

    remarks = db.Column(db.Text)

    # Approval chain
    approved_by_id = db.Column(db.String(36), db.ForeignKey("users.id"))
    approved_at = db.Column(db.DateTime)

    created_by_id = db.Column(db.String(36), db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    approved_by = db.relationship("User", foreign_keys=[approved_by_id])

    def to_dict(self):
        return {
            "id": self.id,
            "invoice_id": self.invoice_id,
            "payment_order_no": self.payment_order_no,
            "payment_amount": float(self.payment_amount),
            "payment_mode": self.payment_mode,
            "utr_no": self.utr_no,
            "payment_date": self.payment_date.isoformat() if self.payment_date else None,
            "status": self.status,
            "remarks": self.remarks,
            "created_at": self.created_at.isoformat(),
        }
