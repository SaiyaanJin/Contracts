"""
Tender, PreBidMeeting, TenderCorrigendum, TenderDocument Models
"""
import uuid
from datetime import datetime
from ..extensions import db


class Tender(db.Model):
    __tablename__ = "tenders"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    contract_id = db.Column(db.String(36), db.ForeignKey("contracts.id"))

    # GeM / Portal Details
    gem_bid_no = db.Column(db.String(100))
    tender_no = db.Column(db.String(100), unique=True, nullable=False)
    nit_no = db.Column(db.String(100))  # Notice Inviting Tender

    # Bid Classification
    bid_type = db.Column(db.String(50))     # GeM Bid, Limited Tender, Open Tender, Rate Contract
    procurement_method = db.Column(db.String(50))  # GeM, ICB, LCB, Direct
    bid_category = db.Column(db.String(100))  # Works, Goods, Services

    # Title & Description
    title = db.Column(db.String(500), nullable=False)
    scope = db.Column(db.Text)
    specifications = db.Column(db.Text)

    # Financial
    estimated_cost = db.Column(db.Numeric(15, 2))
    emd_required = db.Column(db.Boolean, default=False)
    emd_amount = db.Column(db.Numeric(15, 2))
    emd_exemption = db.Column(db.Boolean, default=False)  # MSME/Startup exemption
    epbg_required = db.Column(db.Boolean, default=False)
    epbg_percentage = db.Column(db.Numeric(5, 2))

    # Dates
    publish_date = db.Column(db.DateTime)
    pre_bid_meeting_date = db.Column(db.DateTime)
    bid_submission_start = db.Column(db.DateTime)
    bid_submission_end = db.Column(db.DateTime)    # Closing date
    bid_opening_date = db.Column(db.DateTime)
    validity_days = db.Column(db.Integer, default=180)  # Bid validity

    # Contract Period (for this tender)
    contract_period_value = db.Column(db.Integer)
    contract_period_unit = db.Column(db.String(10))

    # Eligibility / Technical Criteria
    eligibility_criteria = db.Column(db.Text)
    experience_required = db.Column(db.Text)
    min_turnover = db.Column(db.Numeric(15, 2))
    technical_qualifications = db.Column(db.Text)

    # GeM Preferences
    mse_preference = db.Column(db.Boolean, default=False)
    startup_preference = db.Column(db.Boolean, default=False)
    make_in_india = db.Column(db.Boolean, default=False)

    # Status Flow
    status = db.Column(db.String(50), default="Draft")
    # Draft → Vetting → Approved → Published → Pre-Bid → Opened → Evaluation → Awarded → Closed

    # Workflow
    workflow_id = db.Column(db.String(36), db.ForeignKey("workflows.id"))

    # Organization
    department = db.Column(db.String(100))
    region = db.Column(db.String(50))

    created_by_id = db.Column(db.String(36), db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    pre_bid_meetings = db.relationship("PreBidMeeting", backref="tender", lazy="dynamic")
    corrigenda = db.relationship("TenderCorrigendum", backref="tender", lazy="dynamic")
    documents = db.relationship("TenderDocument", backref="tender", lazy="dynamic")
    bid_evaluations = db.relationship("BidEvaluation", backref="tender", lazy="dynamic")

    def to_dict(self, include_relations=False):
        data = {
            "id": self.id,
            "contract_id": self.contract_id,
            "gem_bid_no": self.gem_bid_no,
            "tender_no": self.tender_no,
            "title": self.title,
            "bid_type": self.bid_type,
            "procurement_method": self.procurement_method,
            "estimated_cost": float(self.estimated_cost) if self.estimated_cost else None,
            "emd_required": self.emd_required,
            "emd_amount": float(self.emd_amount) if self.emd_amount else None,
            "epbg_required": self.epbg_required,
            "epbg_percentage": float(self.epbg_percentage) if self.epbg_percentage else None,
            "publish_date": self.publish_date.isoformat() if self.publish_date else None,
            "bid_submission_end": self.bid_submission_end.isoformat() if self.bid_submission_end else None,
            "bid_opening_date": self.bid_opening_date.isoformat() if self.bid_opening_date else None,
            "validity_days": self.validity_days,
            "contract_period_value": self.contract_period_value,
            "contract_period_unit": self.contract_period_unit,
            "mse_preference": self.mse_preference,
            "startup_preference": self.startup_preference,
            "make_in_india": self.make_in_india,
            "status": self.status,
            "department": self.department,
            "region": self.region,
            "created_at": self.created_at.isoformat(),
        }
        if include_relations:
            data["bids_count"] = self.bid_evaluations.count()
            data["corrigenda_count"] = self.corrigenda.count()
        return data


class PreBidMeeting(db.Model):
    __tablename__ = "pre_bid_meetings"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    tender_id = db.Column(db.String(36), db.ForeignKey("tenders.id"), nullable=False)

    meeting_date = db.Column(db.DateTime, nullable=False)
    venue = db.Column(db.String(300))
    mode = db.Column(db.String(50), default="Physical")  # Physical, Virtual, Hybrid
    meeting_link = db.Column(db.String(500))

    # Minutes of Meeting
    mom = db.Column(db.Text)
    mom_document_id = db.Column(db.String(36), db.ForeignKey("documents.id"))
    mom_finalized = db.Column(db.Boolean, default=False)

    created_by_id = db.Column(db.String(36), db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "tender_id": self.tender_id,
            "meeting_date": self.meeting_date.isoformat(),
            "venue": self.venue,
            "mode": self.mode,
            "mom_finalized": self.mom_finalized,
        }


class TenderCorrigendum(db.Model):
    __tablename__ = "tender_corrigenda"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    tender_id = db.Column(db.String(36), db.ForeignKey("tenders.id"), nullable=False)

    corrigendum_no = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(300))
    description = db.Column(db.Text, nullable=False)
    impact_on_dates = db.Column(db.Boolean, default=False)
    new_bid_closing_date = db.Column(db.DateTime)

    document_id = db.Column(db.String(36), db.ForeignKey("documents.id"))
    published_at = db.Column(db.DateTime)

    created_by_id = db.Column(db.String(36), db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "tender_id": self.tender_id,
            "corrigendum_no": self.corrigendum_no,
            "title": self.title,
            "description": self.description,
            "new_bid_closing_date": self.new_bid_closing_date.isoformat() if self.new_bid_closing_date else None,
            "created_at": self.created_at.isoformat(),
        }


class TenderDocument(db.Model):
    __tablename__ = "tender_documents"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    tender_id = db.Column(db.String(36), db.ForeignKey("tenders.id"), nullable=False)

    doc_type = db.Column(db.String(100))
    # Bid Document, ATC, BOQ, Scope, Corrigendum, MOM, Draft LOA, etc.
    filename = db.Column(db.String(500))
    storage_path = db.Column(db.String(1000))
    version = db.Column(db.Integer, default=1)
    is_public = db.Column(db.Boolean, default=False)

    uploaded_by_id = db.Column(db.String(36), db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
