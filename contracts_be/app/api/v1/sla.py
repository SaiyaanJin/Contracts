"""
SLA Management API
"""
from flask import request, jsonify, g
from datetime import datetime
from . import api_v1_bp
from ...extensions import db
from ...models.sla import SLAMatrix, SLABreach
from ...utils.decorators import require_auth, require_permission


@api_v1_bp.route("/sla/<string:contract_id>", methods=["GET"])
@require_auth
def get_sla_matrix(contract_id):
    slas = SLAMatrix.query.filter_by(contract_id=contract_id, is_active=True).all()
    return jsonify([s.to_dict() for s in slas])


@api_v1_bp.route("/sla", methods=["POST"])
@require_auth
@require_permission("sla", "create")
def create_sla():
    data = request.get_json()
    sla = SLAMatrix(
        contract_id=data["contract_id"],
        metric_name=data["metric_name"],
        metric_type=data.get("metric_type"),
        threshold_value=data.get("threshold_value"),
        threshold_unit=data.get("threshold_unit"),
        measurement_period=data.get("measurement_period", "Monthly"),
        penalty_type=data.get("penalty_type"),
        penalty_rate=data.get("penalty_rate"),
        max_penalty_cap=data.get("max_penalty_cap"),
        escalation_level1_id=data.get("escalation_level1_id"),
        escalation_level2_id=data.get("escalation_level2_id"),
        escalation_hours=data.get("escalation_hours", 24),
        created_by_id=g.current_user.id,
    )
    db.session.add(sla)
    db.session.commit()
    return jsonify(sla.to_dict()), 201


@api_v1_bp.route("/sla/breaches", methods=["GET"])
@require_auth
def list_breaches():
    contract_id = request.args.get("contract_id")
    status = request.args.get("status", "Open")
    query = SLABreach.query
    if contract_id:
        query = query.filter_by(contract_id=contract_id)
    if status:
        query = query.filter_by(status=status)
    return jsonify([b.to_dict() for b in query.order_by(SLABreach.breach_date.desc()).limit(50)])


@api_v1_bp.route("/sla/breaches", methods=["POST"])
@require_auth
@require_permission("sla", "create")
def report_breach():
    data = request.get_json()
    sla = SLAMatrix.query.get_or_404(data["sla_id"])
    breach = SLABreach(
        sla_id=data["sla_id"],
        contract_id=sla.contract_id,
        breach_date=datetime.fromisoformat(data.get("breach_date", datetime.utcnow().isoformat())),
        breach_description=data.get("breach_description"),
        actual_value=data.get("actual_value"),
        threshold_value=sla.threshold_value,
        reported_by_id=g.current_user.id,
        status="Open",
    )
    # Calculate penalty
    if sla.penalty_rate and data.get("actual_value"):
        if sla.penalty_type == "Percentage":
            breach.penalty_amount = (float(sla.penalty_rate) / 100)
        else:
            breach.penalty_amount = float(sla.penalty_rate)

    db.session.add(breach)
    db.session.commit()
    return jsonify(breach.to_dict()), 201


@api_v1_bp.route("/sla/breaches/<string:breach_id>/resolve", methods=["POST"])
@require_auth
@require_permission("sla", "update")
def resolve_breach(breach_id):
    breach = SLABreach.query.get_or_404(breach_id)
    data = request.get_json()
    breach.resolved_date = datetime.utcnow()
    breach.resolution_notes = data.get("resolution_notes")
    breach.status = "Resolved"
    db.session.commit()
    return jsonify(breach.to_dict())
