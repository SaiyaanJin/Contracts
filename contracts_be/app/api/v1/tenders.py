"""
Tender Management API — Full GeM Tender lifecycle
"""
from datetime import datetime
from flask import request, jsonify, g
from sqlalchemy import or_

from . import api_v1_bp
from ...extensions import db
from ...models.tender import Tender, PreBidMeeting, TenderCorrigendum
from ...models.bid import BidVendor, BidVetting, BidEvaluation
from ...models.award import Award
from ...utils.decorators import require_auth, require_permission


@api_v1_bp.route("/tenders", methods=["GET"])
@require_auth
def list_tenders():
    page = request.args.get("page", 1, type=int)
    per_page = min(request.args.get("per_page", 20, type=int), 100)
    status = request.args.get("status")
    department = request.args.get("department")
    search = request.args.get("search")

    query = Tender.query
    if status:
        query = query.filter_by(status=status)
    if department:
        query = query.filter_by(department=department)
    if search:
        query = query.filter(or_(
            Tender.title.ilike(f"%{search}%"),
            Tender.gem_bid_no.ilike(f"%{search}%"),
            Tender.tender_no.ilike(f"%{search}%"),
        ))

    query = query.order_by(Tender.created_at.desc())
    paginated = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "tenders": [t.to_dict() for t in paginated.items],
        "pagination": {
            "page": page, "per_page": per_page,
            "total": paginated.total, "pages": paginated.pages,
        }
    })


@api_v1_bp.route("/tenders/<string:tender_id>", methods=["GET"])
@require_auth
def get_tender(tender_id):
    tender = Tender.query.get_or_404(tender_id)
    data = tender.to_dict(include_relations=True)
    data["pre_bid_meetings"] = [m.to_dict() for m in tender.pre_bid_meetings]
    data["corrigenda"] = [c.to_dict() for c in tender.corrigenda]
    data["bid_vendors"] = [bv.to_dict() for bv in BidVendor.query.filter_by(tender_id=tender_id)]
    return jsonify(data)


@api_v1_bp.route("/tenders", methods=["POST"])
@require_auth
@require_permission("tenders", "create")
def create_tender():
    data = request.get_json()
    required = ["title", "department"]
    missing = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"error": f"Missing: {', '.join(missing)}"}), 400

    # Auto-generate tender number
    count = Tender.query.count()
    year = datetime.utcnow().year
    tender_no = f"ERLDC/TND/{year}/{count + 1:04d}"

    def parse_dt(s):
        if s:
            try:
                return datetime.fromisoformat(s)
            except Exception:
                return None
        return None

    tender = Tender(
        contract_id=data.get("contract_id"),
        gem_bid_no=data.get("gem_bid_no"),
        tender_no=tender_no,
        nit_no=data.get("nit_no"),
        bid_type=data.get("bid_type"),
        procurement_method=data.get("procurement_method"),
        bid_category=data.get("bid_category"),
        title=data["title"],
        scope=data.get("scope"),
        specifications=data.get("specifications"),
        estimated_cost=data.get("estimated_cost"),
        emd_required=data.get("emd_required", False),
        emd_amount=data.get("emd_amount"),
        emd_exemption=data.get("emd_exemption", False),
        epbg_required=data.get("epbg_required", False),
        epbg_percentage=data.get("epbg_percentage"),
        publish_date=parse_dt(data.get("publish_date")),
        pre_bid_meeting_date=parse_dt(data.get("pre_bid_meeting_date")),
        bid_submission_start=parse_dt(data.get("bid_submission_start")),
        bid_submission_end=parse_dt(data.get("bid_submission_end")),
        bid_opening_date=parse_dt(data.get("bid_opening_date")),
        validity_days=data.get("validity_days", 180),
        contract_period_value=data.get("contract_period_value"),
        contract_period_unit=data.get("contract_period_unit", "Months"),
        eligibility_criteria=data.get("eligibility_criteria"),
        experience_required=data.get("experience_required"),
        min_turnover=data.get("min_turnover"),
        technical_qualifications=data.get("technical_qualifications"),
        mse_preference=data.get("mse_preference", False),
        startup_preference=data.get("startup_preference", False),
        make_in_india=data.get("make_in_india", False),
        department=data["department"],
        region=data.get("region"),
        status="Draft",
        created_by_id=g.current_user.id,
    )
    db.session.add(tender)
    db.session.commit()
    return jsonify(tender.to_dict()), 201


@api_v1_bp.route("/tenders/<string:tender_id>", methods=["PUT"])
@require_auth
@require_permission("tenders", "update")
def update_tender(tender_id):
    tender = Tender.query.get_or_404(tender_id)
    data = request.get_json()

    updatable = [
        "gem_bid_no", "nit_no", "bid_type", "procurement_method", "bid_category",
        "title", "scope", "specifications", "estimated_cost",
        "emd_required", "emd_amount", "emd_exemption",
        "epbg_required", "epbg_percentage", "validity_days",
        "contract_period_value", "contract_period_unit",
        "eligibility_criteria", "experience_required", "min_turnover",
        "mse_preference", "startup_preference", "make_in_india", "status",
    ]
    for field in updatable:
        if field in data:
            setattr(tender, field, data[field])

    def parse_dt(s):
        if s:
            try:
                return datetime.fromisoformat(s)
            except Exception:
                return None
        return None

    for dt_field in ["publish_date", "bid_submission_start", "bid_submission_end",
                      "bid_opening_date", "pre_bid_meeting_date"]:
        if dt_field in data:
            setattr(tender, dt_field, parse_dt(data[dt_field]))

    db.session.commit()
    return jsonify(tender.to_dict())


@api_v1_bp.route("/tenders/<string:tender_id>/pre-bid", methods=["POST"])
@require_auth
@require_permission("tenders", "update")
def add_pre_bid_meeting(tender_id):
    Tender.query.get_or_404(tender_id)
    data = request.get_json()
    meeting = PreBidMeeting(
        tender_id=tender_id,
        meeting_date=datetime.fromisoformat(data["meeting_date"]),
        venue=data.get("venue"),
        mode=data.get("mode", "Physical"),
        meeting_link=data.get("meeting_link"),
        created_by_id=g.current_user.id,
    )
    db.session.add(meeting)
    db.session.commit()
    return jsonify(meeting.to_dict()), 201


@api_v1_bp.route("/tenders/<string:tender_id>/corrigendum", methods=["POST"])
@require_auth
@require_permission("tenders", "update")
def add_corrigendum(tender_id):
    Tender.query.get_or_404(tender_id)
    data = request.get_json()
    count = TenderCorrigendum.query.filter_by(tender_id=tender_id).count()
    corrigendum = TenderCorrigendum(
        tender_id=tender_id,
        corrigendum_no=count + 1,
        title=data.get("title"),
        description=data["description"],
        impact_on_dates=data.get("impact_on_dates", False),
        new_bid_closing_date=datetime.fromisoformat(data["new_bid_closing_date"]) if data.get("new_bid_closing_date") else None,
        created_by_id=g.current_user.id,
    )
    db.session.add(corrigendum)
    db.session.commit()
    return jsonify(corrigendum.to_dict()), 201


@api_v1_bp.route("/tenders/<string:tender_id>/bid-vendors", methods=["POST"])
@require_auth
@require_permission("tenders", "update")
def add_bid_vendor(tender_id):
    Tender.query.get_or_404(tender_id)
    data = request.get_json() or {}
    
    vendor_id = data.get("vendor_id")
    if vendor_id:
        from ...models.vendor import Vendor
        vendor = Vendor.query.get(vendor_id)
        if vendor and vendor.status == "Blacklisted":
            return jsonify({"error": f"Cannot register bid: Vendor '{vendor.name}' is blacklisted due to: {vendor.blacklist_reason or 'No reason provided'}"}), 400

    bv = BidVendor(
        tender_id=tender_id,
        vendor_id=data["vendor_id"],
        bid_reference_no=data.get("bid_reference_no"),
        bid_submission_date=datetime.fromisoformat(data["bid_submission_date"]) if data.get("bid_submission_date") else None,
        quoted_amount=data.get("quoted_amount"),
        emd_submitted=data.get("emd_submitted", False),
        emd_amount=data.get("emd_amount"),
    )
    db.session.add(bv)
    db.session.commit()
    return jsonify(bv.to_dict()), 201


@api_v1_bp.route("/tenders/<string:tender_id>/sync-gem", methods=["POST"])
@require_auth
@require_permission("tenders", "update")
def sync_gem_bid(tender_id):
    """Synchronize tender details with mock National GeM Portal API"""
    tender = Tender.query.get_or_404(tender_id)
    tender.status = "Evaluation"
    
    from ...models.bid import BidVendor
    from ...models.vendor import Vendor
    import random
    
    vendor = Vendor.query.first()
    if vendor:
        bv = BidVendor.query.filter_by(tender_id=tender_id, vendor_id=vendor.id).first()
        if not bv:
            bv = BidVendor(
                tender_id=tender_id,
                vendor_id=vendor.id,
                bid_reference_no=f"GEM-BID-REC-{random.randint(100,999)}",
                bid_submission_date=datetime.utcnow(),
                quoted_amount=float(tender.estimated_cost or 5000000.00) * 0.95,
                emd_submitted=True,
                emd_amount=100000.00,
            )
            db.session.add(bv)
            
    db.session.commit()
    return jsonify({
        "status": "success",
        "message": "Successfully synchronized tender with GeM Portal.",
        "tender": tender.to_dict()
    })

