"""
BidEvaluation, BidVetting, BidVendor Models
"""
import uuid
from datetime import datetime
from ..extensions import db


class BidVendor(db.Model):
    """Vendors who submitted bids for a tender"""
    __tablename__ = "bid_vendors"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    tender_id = db.Column(db.String(36), db.ForeignKey("tenders.id"), nullable=False)
    vendor_id = db.Column(db.String(36), db.ForeignKey("vendors.id"), nullable=False)

    # Bid details
    bid_reference_no = db.Column(db.String(100))
    bid_submission_date = db.Column(db.DateTime)
    quoted_amount = db.Column(db.Numeric(15, 2))
    bid_validity_date = db.Column(db.Date)

    # EMD
    emd_submitted = db.Column(db.Boolean, default=False)
    emd_amount = db.Column(db.Numeric(15, 2))
    emd_instrument_no = db.Column(db.String(100))

    # Qualification status
    technically_qualified = db.Column(db.Boolean)
    commercially_qualified = db.Column(db.Boolean)
    l1 = db.Column(db.Boolean, default=False)  # Lowest bidder flag

    # Documents submitted
    documents_submitted = db.Column(db.Boolean, default=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    vendor = db.relationship("Vendor")

    def to_dict(self):
        return {
            "id": self.id,
            "tender_id": self.tender_id,
            "vendor_id": self.vendor_id,
            "vendor_name": self.vendor.name if self.vendor else None,
            "bid_reference_no": self.bid_reference_no,
            "bid_submission_date": self.bid_submission_date.isoformat() if self.bid_submission_date else None,
            "quoted_amount": float(self.quoted_amount) if self.quoted_amount else None,
            "emd_submitted": self.emd_submitted,
            "technically_qualified": self.technically_qualified,
            "commercially_qualified": self.commercially_qualified,
            "l1": self.l1,
        }


class BidVetting(db.Model):
    """Checklist-based bid document vetting"""
    __tablename__ = "bid_vettings"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    tender_id = db.Column(db.String(36), db.ForeignKey("tenders.id"), nullable=False)

    vetting_type = db.Column(db.String(50))  # Legal, Technical, Finance, Commercial

    # Reviewer
    reviewer_id = db.Column(db.String(36), db.ForeignKey("users.id"))
    review_date = db.Column(db.DateTime)

    # Checklist (stored as JSON)
    checklist = db.Column(db.Text)  # JSON array of {item, status, remarks}

    # Summary
    overall_compliance = db.Column(db.String(50))  # Compliant, Non-Compliant, Conditionally Compliant
    compliance_score = db.Column(db.Numeric(5, 2))
    observations = db.Column(db.Text)
    recommendations = db.Column(db.Text)

    status = db.Column(db.String(50), default="Pending")  # Pending, In Progress, Completed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    reviewer = db.relationship("User", foreign_keys=[reviewer_id])

    def to_dict(self):
        import json
        return {
            "id": self.id,
            "tender_id": self.tender_id,
            "vetting_type": self.vetting_type,
            "reviewer": self.reviewer.to_dict() if self.reviewer else None,
            "review_date": self.review_date.isoformat() if self.review_date else None,
            "checklist": json.loads(self.checklist) if self.checklist else [],
            "overall_compliance": self.overall_compliance,
            "compliance_score": float(self.compliance_score) if self.compliance_score else None,
            "observations": self.observations,
            "recommendations": self.recommendations,
            "status": self.status,
        }


class BidEvaluation(db.Model):
    """Technical & Commercial Evaluation"""
    __tablename__ = "bid_evaluations"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    tender_id = db.Column(db.String(36), db.ForeignKey("tenders.id"), nullable=False)
    bid_vendor_id = db.Column(db.String(36), db.ForeignKey("bid_vendors.id"), nullable=False)

    evaluation_type = db.Column(db.String(50))  # Technical, Commercial

    # Technical Evaluation
    experience_verified = db.Column(db.Boolean)
    turnover_verified = db.Column(db.Boolean)
    documents_verified = db.Column(db.Boolean)
    technical_score = db.Column(db.Numeric(5, 2))
    technical_remarks = db.Column(db.Text)
    technical_status = db.Column(db.String(50))  # Qualified, Disqualified, Conditional

    # Commercial Evaluation
    commercial_score = db.Column(db.Numeric(5, 2))
    commercial_remarks = db.Column(db.Text)
    negotiated_amount = db.Column(db.Numeric(15, 2))

    # Compliance Matrix (JSON)
    compliance_matrix = db.Column(db.Text)  # JSON array

    # Evaluator
    evaluated_by_id = db.Column(db.String(36), db.ForeignKey("users.id"))
    evaluation_date = db.Column(db.DateTime, default=datetime.utcnow)

    # TEC Committee
    tec_recommendation = db.Column(db.Text)
    tec_approved_by_id = db.Column(db.String(36), db.ForeignKey("users.id"))
    tec_approved_at = db.Column(db.DateTime)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    bid_vendor = db.relationship("BidVendor")
    evaluated_by = db.relationship("User", foreign_keys=[evaluated_by_id])

    def to_dict(self):
        import json
        return {
            "id": self.id,
            "tender_id": self.tender_id,
            "bid_vendor": self.bid_vendor.to_dict() if self.bid_vendor else None,
            "evaluation_type": self.evaluation_type,
            "technical_score": float(self.technical_score) if self.technical_score else None,
            "technical_status": self.technical_status,
            "commercial_score": float(self.commercial_score) if self.commercial_score else None,
            "negotiated_amount": float(self.negotiated_amount) if self.negotiated_amount else None,
            "compliance_matrix": json.loads(self.compliance_matrix) if self.compliance_matrix else [],
            "tec_recommendation": self.tec_recommendation,
            "evaluation_date": self.evaluation_date.isoformat() if self.evaluation_date else None,
        }
