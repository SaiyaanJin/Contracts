"""
Dashboard API — Executive KPIs and Analytics
"""
from datetime import date, timedelta
from flask import jsonify, request
from sqlalchemy import func, and_

from . import api_v1_bp
from ...extensions import db
from ...models.contract import Contract
from ...models.tender import Tender
from ...models.invoice import Invoice
from ...models.payment import Payment
from ...models.vendor import Vendor
from ...models.sla import SLABreach
from ...utils.decorators import require_auth


@api_v1_bp.route("/dashboard/summary", methods=["GET"])
@require_auth
def dashboard_summary():
    """Executive KPI summary cards"""
    today = date.today()
    in_30 = today + timedelta(days=30)
    in_90 = today + timedelta(days=90)

    # Contract counts
    total = Contract.query.count()
    active = Contract.query.filter(
        Contract.end_date >= today,
        Contract.status.notin_(["Terminated", "Completed"])
    ).count()
    expiring_30 = Contract.query.filter(
        Contract.end_date.between(today, in_30),
        Contract.status.notin_(["Terminated", "Completed"])
    ).count()
    expiring_90 = Contract.query.filter(
        Contract.end_date.between(today, in_90),
        Contract.status.notin_(["Terminated", "Completed"])
    ).count()
    expired = Contract.query.filter(
        Contract.end_date < today,
        Contract.status.notin_(["Terminated", "Completed"])
    ).count()
    terminated = Contract.query.filter_by(status="Terminated").count()
    completed = Contract.query.filter_by(status="Completed").count()

    # Total contract value
    total_value = db.session.query(func.sum(Contract.contract_value)).scalar() or 0
    active_value = db.session.query(func.sum(Contract.contract_value)).filter(
        Contract.end_date >= today,
        Contract.status.notin_(["Terminated", "Completed"])
    ).scalar() or 0

    # Tender counts
    tender_draft = Tender.query.filter_by(status="Draft").count()
    tender_published = Tender.query.filter_by(status="Published").count()
    tender_evaluation = Tender.query.filter_by(status="Evaluation").count()

    # Invoice stats
    invoice_pending = Invoice.query.filter_by(status="Submitted").count()
    invoice_sdac = Invoice.query.filter_by(status="SDAC").count()
    invoice_approved = Invoice.query.filter(
        Invoice.finance_approved == True  # noqa: E712
    ).count()

    # Payment pending
    payment_pending = Payment.query.filter_by(status="Pending").count()
    payment_total = db.session.query(func.sum(Payment.payment_amount)).filter_by(
        status="Paid"
    ).scalar() or 0

    # SLA breaches (open)
    sla_open = SLABreach.query.filter_by(status="Open").count()

    # Vendor count
    vendor_count = Vendor.query.filter_by(status="Active").count()

    return jsonify({
        "contracts": {
            "total": total,
            "active": active,
            "expiring_30_days": expiring_30,
            "expiring_90_days": expiring_90,
            "expired": expired,
            "terminated": terminated,
            "completed": completed,
            "total_value": float(total_value),
            "active_value": float(active_value),
        },
        "tenders": {
            "draft": tender_draft,
            "published": tender_published,
            "evaluation": tender_evaluation,
        },
        "invoices": {
            "pending_verification": invoice_pending,
            "pending_sdac": invoice_sdac,
            "pending_payment": invoice_approved,
        },
        "payments": {
            "pending": payment_pending,
            "total_paid": float(payment_total),
        },
        "sla": {
            "open_breaches": sla_open,
        },
        "vendors": {
            "active": vendor_count,
        },
    })


@api_v1_bp.route("/dashboard/by-department", methods=["GET"])
@require_auth
def dashboard_by_department():
    """Contract statistics by department"""
    today = date.today()
    in_30 = today + timedelta(days=30)

    departments = db.session.query(
        Contract.department,
        func.count(Contract.id).label("total"),
        func.sum(Contract.contract_value).label("total_value"),
    ).group_by(Contract.department).all()

    result = []
    for dept, total, total_val in departments:
        active = Contract.query.filter(
            Contract.department == dept,
            Contract.end_date >= today,
            Contract.status.notin_(["Terminated", "Completed"])
        ).count()
        expired = Contract.query.filter(
            Contract.department == dept,
            Contract.end_date < today,
            Contract.status.notin_(["Terminated", "Completed"])
        ).count()
        expiring = Contract.query.filter(
            Contract.department == dept,
            Contract.end_date.between(today, in_30),
            Contract.status.notin_(["Terminated", "Completed"])
        ).count()

        result.append({
            "department": dept,
            "total": total,
            "active": active,
            "expired": expired,
            "expiring_soon": expiring,
            "total_value": float(total_val) if total_val else 0,
        })

    result.sort(key=lambda x: x["total"], reverse=True)
    return jsonify(result)


@api_v1_bp.route("/dashboard/by-region", methods=["GET"])
@require_auth
def dashboard_by_region():
    """Contract statistics by region"""
    regions = db.session.query(
        Contract.region,
        func.count(Contract.id).label("total"),
        func.sum(Contract.contract_value).label("total_value"),
    ).filter(Contract.region.isnot(None)).group_by(Contract.region).all()

    return jsonify([
        {
            "region": r,
            "total": total,
            "total_value": float(tv) if tv else 0,
        }
        for r, total, tv in regions
    ])


@api_v1_bp.route("/dashboard/contract-value-trend", methods=["GET"])
@require_auth
def contract_value_trend():
    """Monthly contract value trend for past 12 months"""
    from sqlalchemy.sql.expression import extract

    results = db.session.query(
        extract("year", Contract.award_date).label("year"),
        extract("month", Contract.award_date).label("month"),
        func.count(Contract.id).label("count"),
        func.sum(Contract.contract_value).label("value"),
    ).filter(
        Contract.award_date.isnot(None)
    ).group_by("year", "month").order_by("year", "month").limit(12).all()

    return jsonify([
        {
            "year": int(r.year),
            "month": int(r.month),
            "count": r.count,
            "value": float(r.value) if r.value else 0,
        }
        for r in results
    ])


@api_v1_bp.route("/dashboard/expiry-forecast", methods=["GET"])
@require_auth
def expiry_forecast():
    """Contracts expiring in next 180 days grouped by month"""
    today = date.today()
    in_180 = today + timedelta(days=180)

    from sqlalchemy.sql.expression import extract

    results = db.session.query(
        extract("year", Contract.end_date).label("year"),
        extract("month", Contract.end_date).label("month"),
        func.count(Contract.id).label("count"),
        func.sum(Contract.contract_value).label("value"),
    ).filter(
        Contract.end_date.between(today, in_180),
        Contract.status.notin_(["Terminated", "Completed"])
    ).group_by("year", "month").order_by("year", "month").all()

    return jsonify([
        {
            "year": int(r.year),
            "month": int(r.month),
            "count": r.count,
            "value": float(r.value) if r.value else 0,
        }
        for r in results
    ])


@api_v1_bp.route("/dashboard/procurement-pipeline", methods=["GET"])
@require_auth
def procurement_pipeline():
    """Procurement funnel: Initiation → Tender → Evaluation → Award → Execution"""
    stages = {
        "Initiation": Contract.query.filter_by(lifecycle_stage="Initiation").count(),
        "Procurement": Contract.query.filter_by(lifecycle_stage="Procurement").count(),
        "Tender Evaluation": Tender.query.filter(
            Tender.status.in_(["Evaluation", "Opened"])
        ).count(),
        "Award": Contract.query.filter_by(lifecycle_stage="Award").count(),
        "Execution": Contract.query.filter_by(lifecycle_stage="Execution").count(),
        "Closure": Contract.query.filter_by(lifecycle_stage="Closure").count(),
    }
    return jsonify([{"stage": k, "count": v} for k, v in stages.items()])


@api_v1_bp.route("/dashboard/vendor-performance", methods=["GET"])
@require_auth
def vendor_performance():
    """Top 10 vendors by contract value and performance score"""
    vendors = db.session.query(
        Vendor.id,
        Vendor.name,
        Vendor.performance_score,
        func.count(Contract.id).label("contract_count"),
        func.sum(Contract.contract_value).label("total_value"),
    ).join(Contract, Contract.vendor_id == Vendor.id).group_by(
        Vendor.id, Vendor.name, Vendor.performance_score
    ).order_by(func.sum(Contract.contract_value).desc()).limit(10).all()

    return jsonify([
        {
            "vendor_id": str(v.id),
            "vendor_name": v.name,
            "performance_score": float(v.performance_score) if v.performance_score else 0,
            "contract_count": v.contract_count,
            "total_value": float(v.total_value) if v.total_value else 0,
        }
        for v in vendors
    ])


@api_v1_bp.route("/dashboard/expiry-heatmap", methods=["GET"])
@require_auth
def expiry_heatmap():
    """Aggregates contract expiries across different regions for heatmap display"""
    regions = ["ERLDC HQ", "Patna SLDC", "Bhubaneswar", "Ranchi", "Gangtok"]
    today = date.today()
    in_90 = today + timedelta(days=90)
    
    result = []
    for r in regions:
        total = Contract.query.filter_by(region=r).count()
        active = Contract.query.filter(
            Contract.region == r,
            Contract.end_date >= today,
            Contract.status.notin_(["Terminated", "Completed"])
        ).count()
        expired = Contract.query.filter(
            Contract.region == r,
            Contract.end_date < today,
            Contract.status.notin_(["Terminated", "Completed"])
        ).count()
        expiring_soon = Contract.query.filter(
            Contract.region == r,
            Contract.end_date.between(today, in_90),
            Contract.status.notin_(["Terminated", "Completed"])
        ).count()
        total_value = db.session.query(func.sum(Contract.contract_value)).filter_by(region=r).scalar() or 0
        
        result.append({
            "region": r,
            "total": total,
            "active": active,
            "expired": expired,
            "expiring_soon": expiring_soon,
            "total_value": float(total_value)
        })
        
    return jsonify(result)


@api_v1_bp.route("/dashboard/calendar-events", methods=["GET"])
@require_auth
def calendar_events():
    """Fetch calendar events including tender submissions, pre-bid meetings, and contract expiries"""
    events = []
    
    # Contract Expiries
    contracts = Contract.query.filter(Contract.end_date.isnot(None)).all()
    for c in contracts:
        events.append({
            "id": f"c-exp-{c.id}",
            "title": f"Expiry: {c.name[:30]}...",
            "date": c.end_date.isoformat(),
            "type": "expiry",
            "color": "#EF4444",
            "details": f"Contract No: {c.contract_no} | EIC: {c.eic}"
        })
        
    # Pre-Bid Meetings
    tenders = Tender.query.filter(Tender.pre_bid_meeting_date.isnot(None)).all()
    for t in tenders:
        events.append({
            "id": f"t-pb-{t.id}",
            "title": f"Pre-Bid: {t.title[:30]}...",
            "date": t.pre_bid_meeting_date.isoformat(),
            "type": "pre_bid",
            "color": "#3B82F6",
            "details": f"GeM Bid No: {t.gem_bid_no} | Dept: {t.department}"
        })
        
    # Tender Closings
    tenders_end = Tender.query.filter(Tender.bid_submission_end.isnot(None)).all()
    for t in tenders_end:
        events.append({
            "id": f"t-end-{t.id}",
            "title": f"Closing: {t.title[:30]}...",
            "date": t.bid_submission_end.isoformat(),
            "type": "tender_close",
            "color": "#F59E0B",
            "details": f"Tender Ref: {t.tender_no}"
        })
        
    return jsonify(events)

