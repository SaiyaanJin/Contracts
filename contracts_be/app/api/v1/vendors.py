"""
Vendor Management API
"""
from flask import request, jsonify, g
from sqlalchemy import or_, func

from . import api_v1_bp
from ...extensions import db
from ...models.vendor import Vendor, VendorDocument, VendorScore
from ...models.contract import Contract
from ...utils.decorators import require_auth, require_permission


@api_v1_bp.route("/vendors", methods=["GET"])
@require_auth
def list_vendors():
    page = request.args.get("page", 1, type=int)
    per_page = min(request.args.get("per_page", 20, type=int), 100)
    search = request.args.get("search")
    status = request.args.get("status", "Active")
    is_msme = request.args.get("is_msme", type=lambda v: v.lower() == "true")

    query = Vendor.query
    if status:
        query = query.filter_by(status=status)
    if is_msme is not None:
        query = query.filter_by(is_msme=is_msme)
    if search:
        query = query.filter(or_(
            Vendor.name.ilike(f"%{search}%"),
            Vendor.pan.ilike(f"%{search}%"),
            Vendor.gstin.ilike(f"%{search}%"),
            Vendor.vendor_code.ilike(f"%{search}%"),
        ))

    query = query.order_by(Vendor.name)
    paginated = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "vendors": [v.to_dict() for v in paginated.items],
        "pagination": {
            "page": page, "per_page": per_page,
            "total": paginated.total, "pages": paginated.pages,
        }
    })


@api_v1_bp.route("/vendors/<string:vendor_id>", methods=["GET"])
@require_auth
def get_vendor(vendor_id):
    vendor = Vendor.query.get_or_404(vendor_id)
    data = vendor.to_dict(include_score=True)
    # Add contract stats
    data["contract_stats"] = {
        "total": Contract.query.filter_by(vendor_id=vendor_id).count(),
        "active": Contract.query.filter_by(vendor_id=vendor_id).filter(
            Contract.status.notin_(["Terminated", "Completed", "Expired"])
        ).count(),
    }
    return jsonify(data)


@api_v1_bp.route("/vendors", methods=["POST"])
@require_auth
@require_permission("vendors", "create")
def create_vendor():
    data = request.get_json()
    required = ["name"]
    missing = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"error": f"Missing: {', '.join(missing)}"}), 400

    # Generate vendor code
    count = Vendor.query.count()
    vendor_code = f"VND-{count + 1:05d}"

    vendor = Vendor(
        vendor_code=vendor_code,
        name=data["name"],
        short_name=data.get("short_name"),
        pan=data.get("pan"),
        gstin=data.get("gstin"),
        cin=data.get("cin"),
        is_msme=data.get("is_msme", False),
        msme_certificate_no=data.get("msme_certificate_no"),
        msme_category=data.get("msme_category"),
        is_startup=data.get("is_startup", False),
        startup_certificate_no=data.get("startup_certificate_no"),
        contact_person=data.get("contact_person"),
        email=data.get("email"),
        phone=data.get("phone"),
        website=data.get("website"),
        address_line1=data.get("address_line1"),
        address_line2=data.get("address_line2"),
        city=data.get("city"),
        state=data.get("state"),
        pin_code=data.get("pin_code"),
        bank_name=data.get("bank_name"),
        bank_account_no=data.get("bank_account_no"),
        bank_ifsc=data.get("bank_ifsc"),
        bank_branch=data.get("bank_branch"),
        annual_turnover=data.get("annual_turnover"),
        turnover_year=data.get("turnover_year"),
        created_by_id=g.current_user.id,
    )
    db.session.add(vendor)
    db.session.commit()
    return jsonify(vendor.to_dict()), 201


@api_v1_bp.route("/vendors/<string:vendor_id>", methods=["PUT"])
@require_auth
@require_permission("vendors", "update")
def update_vendor(vendor_id):
    vendor = Vendor.query.get_or_404(vendor_id)
    data = request.get_json()
    fields = [
        "name", "short_name", "pan", "gstin", "cin",
        "is_msme", "msme_certificate_no", "msme_category",
        "is_startup", "startup_certificate_no",
        "contact_person", "email", "phone", "website",
        "address_line1", "address_line2", "city", "state", "pin_code",
        "bank_name", "bank_account_no", "bank_ifsc", "bank_branch",
        "annual_turnover", "turnover_year", "status", "blacklist_reason",
    ]
    for f in fields:
        if f in data:
            setattr(vendor, f, data[f])
            
    if "blacklist_date" in data:
        from datetime import date
        vendor.blacklist_date = date.fromisoformat(data["blacklist_date"]) if data["blacklist_date"] else None
        
    db.session.commit()
    return jsonify(vendor.to_dict())


@api_v1_bp.route("/vendors/<string:vendor_id>/score", methods=["POST"])
@require_auth
@require_permission("vendors", "update")
def add_vendor_score(vendor_id):
    vendor = Vendor.query.get_or_404(vendor_id)
    data = request.get_json()

    # Calculate overall score (weighted average)
    quality = data.get("quality_score", 0)
    timeliness = data.get("timeliness_score", 0)
    compliance = data.get("compliance_score", 0)
    communication = data.get("communication_score", 0)
    overall = (quality * 0.3 + timeliness * 0.3 + compliance * 0.25 + communication * 0.15)

    score = VendorScore(
        vendor_id=vendor_id,
        contract_id=data.get("contract_id"),
        quality_score=quality,
        timeliness_score=timeliness,
        compliance_score=compliance,
        communication_score=communication,
        overall_score=overall,
        comments=data.get("comments"),
        penalty_count=data.get("penalty_count", 0),
        total_penalty_amount=data.get("total_penalty_amount", 0),
        delays_count=data.get("delays_count", 0),
        evaluated_by_id=g.current_user.id,
    )
    db.session.add(score)

    # Update vendor's overall performance score (rolling average)
    all_scores = VendorScore.query.filter_by(vendor_id=vendor_id).all()
    if all_scores:
        avg = sum(float(s.overall_score) for s in all_scores) / len(all_scores)
        vendor.performance_score = avg

    db.session.commit()
    return jsonify(score.to_dict()), 201
