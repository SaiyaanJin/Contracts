"""
Contracts API — Full CRUD + Lifecycle Management
"""
import json
from datetime import date, timedelta
from flask import request, jsonify, g
from sqlalchemy import or_, and_

from . import api_v1_bp
from ...extensions import db
from ...models.contract import Contract, ContractAmendment, ContractRenewal, ContractMilestone
from ...models.workflow import Workflow, WorkflowStep
from ...models.notification import Notification
from ...models.audit import AuditLog
from ...utils.decorators import require_auth, require_permission, audit_log
from ...services.contract_service import ContractService


@api_v1_bp.route("/contracts", methods=["GET"])
@require_auth
def list_contracts():
    """
    List contracts with filtering, search and pagination.
    Query params: page, per_page, department, status, type, search, region
    """
    page = request.args.get("page", 1, type=int)
    per_page = min(request.args.get("per_page", 20, type=int), 100)
    department = request.args.get("department")
    status = request.args.get("status")
    contract_type = request.args.get("type")
    region = request.args.get("region")
    search = request.args.get("search")
    expiring_days = request.args.get("expiring_days", type=int)

    query = Contract.query

    # Role-based filtering: non-admin users see only their department
    user = g.current_user
    if user.role and user.role.name not in ["admin", "purchase", "finance", "auditor"]:
        if user.department:
            query = query.filter(Contract.department == user.department)

    if department:
        query = query.filter(Contract.department == department)
    if status:
        query = query.filter(Contract.status == status)
    if contract_type:
        query = query.filter(Contract.contract_type == contract_type)
    if region:
        query = query.filter(Contract.region == region)
    if expiring_days:
        today = date.today()
        target = today + timedelta(days=expiring_days)
        query = query.filter(Contract.end_date.between(today, target))
    if search:
        query = query.filter(or_(
            Contract.name.ilike(f"%{search}%"),
            Contract.contract_no.ilike(f"%{search}%"),
            Contract.gem_contract_no.ilike(f"%{search}%"),
            Contract.file_no.ilike(f"%{search}%"),
            Contract.eic.ilike(f"%{search}%"),
        ))

    # Sort by end date (most urgent first)
    query = query.order_by(Contract.end_date.asc())

    paginated = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "contracts": [c.to_dict(include_relations=True) for c in paginated.items],
        "pagination": {
            "page": page,
            "per_page": per_page,
            "total": paginated.total,
            "pages": paginated.pages,
            "has_next": paginated.has_next,
            "has_prev": paginated.has_prev,
        }
    })


@api_v1_bp.route("/contracts/<string:contract_id>", methods=["GET"])
@require_auth
def get_contract(contract_id):
    """Get full contract detail"""
    contract = Contract.query.get_or_404(contract_id)
    data = contract.to_dict(include_relations=True)

    # Include related data
    data["milestones"] = [m.to_dict() for m in contract.milestones.order_by(ContractMilestone.planned_date)]
    data["amendments"] = [a.to_dict() for a in contract.amendments.order_by(ContractAmendment.created_at)]
    data["renewals"] = [r.to_dict() for r in contract.renewals]
    data["invoices_summary"] = {
        "total": contract.invoices.count(),
        "pending": contract.invoices.filter_by(status="Submitted").count(),
        "paid": contract.invoices.filter_by(status="Paid").count(),
    }
    data["sla_summary"] = {
        "total_sla_metrics": contract.sla_matrix.count(),
        "open_breaches": sum(s.breaches.filter_by(status="Open").count() for s in contract.sla_matrix),
    }

    return jsonify(data)


@api_v1_bp.route("/contracts", methods=["POST"])
@require_auth
@require_permission("contracts", "create")
def create_contract():
    """Create new contract / initiation"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    # Block blacklisted vendors
    vendor_id = data.get("vendor_id")
    if vendor_id:
        from ...models.vendor import Vendor
        vendor = Vendor.query.get(vendor_id)
        if vendor and vendor.status == "Blacklisted":
            return jsonify({"error": f"Cannot initiate contract: Vendor '{vendor.name}' is blacklisted due to: {vendor.blacklist_reason or 'No reason provided'}"}), 400

    # Validate required fields
    required = ["name", "department", "contract_type", "end_date"]
    missing = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    # Generate contract number
    contract_no = ContractService.generate_contract_no(data.get("department", ""))

    # Parse dates
    def parse_date(d):
        if d:
            try:
                return date.fromisoformat(d)
            except Exception:
                return None
        return None

    contract = Contract(
        contract_no=contract_no,
        file_no=data.get("file_no"),
        gem_contract_no=data.get("gem_contract_no"),
        name=data["name"],
        short_description=data.get("short_description"),
        scope_of_work=data.get("scope_of_work"),
        deliverables=data.get("deliverables"),
        risks=data.get("risks"),
        department=data["department"],
        region=data.get("region"),
        project=data.get("project"),
        budget_head=data.get("budget_head"),
        funding_source=data.get("funding_source"),
        contract_type=data.get("contract_type"),
        procurement_type=data.get("procurement_type"),
        category=data.get("category"),
        estimated_value=data.get("estimated_value"),
        contract_value=data.get("contract_value"),
        vendor_id=data.get("vendor_id"),
        award_date=parse_date(data.get("award_date")),
        start_date=parse_date(data.get("start_date")),
        end_date=parse_date(data["end_date"]),
        contract_period_value=data.get("contract_period_value"),
        contract_period_unit=data.get("contract_period_unit", "Months"),
        eic=data.get("eic"),
        justification=data.get("justification"),
        sd_bg_required=data.get("sd_bg_required", False),
        sd_bg_amount=data.get("sd_bg_amount"),
        bg_expiry_date=parse_date(data.get("bg_expiry_date")),
        status="Active",
        lifecycle_stage=data.get("lifecycle_stage", "Initiation"),
        created_by_id=g.current_user.id,
    )

    db.session.add(contract)

    # Audit log
    log = AuditLog(
        user_id=g.current_user.id,
        user_name=g.current_user.name,
        user_emp_id=g.current_user.emp_id,
        user_role=g.current_user.role.name if g.current_user.role else None,
        action="CREATE",
        entity_type="contract",
        entity_id=contract.id,
        entity_label=contract.name,
        new_values=json.dumps({"contract_no": contract_no, "name": contract.name}),
        ip_address=request.remote_addr,
        endpoint="/api/v1/contracts",
        http_method="POST",
        success=True,
    )
    db.session.add(log)
    db.session.commit()

    # Trigger notification (async via Celery)
    try:
        from ...tasks.notification_tasks import send_contract_created_notification
        send_contract_created_notification.delay(contract.id)
    except Exception:
        pass

    return jsonify(contract.to_dict()), 201


@api_v1_bp.route("/contracts/<string:contract_id>", methods=["PUT"])
@require_auth
@require_permission("contracts", "update")
def update_contract(contract_id):
    """Update contract details"""
    contract = Contract.query.get_or_404(contract_id)
    data = request.get_json()

    # Track changes for audit
    old_values = {
        "name": contract.name,
        "contract_value": float(contract.contract_value) if contract.contract_value else None,
        "end_date": contract.end_date.isoformat() if contract.end_date else None,
        "status": contract.status,
        "eic": contract.eic,
    }

    # Update allowed fields
    updatable = [
        "name", "short_description", "scope_of_work", "deliverables", "risks",
        "contract_value", "eic", "contract_period_value", "contract_period_unit",
        "sd_bg_required", "sd_bg_amount", "status", "lifecycle_stage",
        "warranty_period_value", "warranty_period_unit",
        "maintenance_period_value", "maintenance_period_unit",
    ]
    for field in updatable:
        if field in data:
            setattr(contract, field, data[field])

    # Date fields
    for date_field in ["award_date", "start_date", "end_date", "bg_expiry_date",
                        "supply_end_date", "installation_end_date", "toc_date",
                        "service_start_date", "subscription_start_date", "subscription_end_date"]:
        if date_field in data and data[date_field]:
            setattr(contract, date_field, date.fromisoformat(data[date_field]))

    contract.updated_by_id = g.current_user.id

    # Audit log
    log = AuditLog(
        user_id=g.current_user.id,
        user_name=g.current_user.name,
        user_emp_id=g.current_user.emp_id,
        user_role=g.current_user.role.name if g.current_user.role else None,
        action="UPDATE",
        entity_type="contract",
        entity_id=contract.id,
        entity_label=contract.name,
        old_values=json.dumps(old_values),
        new_values=json.dumps({k: data[k] for k in updatable if k in data}),
        ip_address=request.remote_addr,
        endpoint=f"/api/v1/contracts/{contract_id}",
        http_method="PUT",
        success=True,
    )
    db.session.add(log)
    db.session.commit()

    return jsonify(contract.to_dict())


@api_v1_bp.route("/contracts/<string:contract_id>", methods=["DELETE"])
@require_auth
@require_permission("contracts", "delete")
def delete_contract(contract_id):
    """Soft delete (mark as terminated)"""
    contract = Contract.query.get_or_404(contract_id)
    old_status = contract.status
    contract.status = "Terminated"

    log = AuditLog(
        user_id=g.current_user.id,
        user_name=g.current_user.name,
        user_emp_id=g.current_user.emp_id,
        user_role=g.current_user.role.name if g.current_user.role else None,
        action="DELETE",
        entity_type="contract",
        entity_id=contract.id,
        entity_label=contract.name,
        old_values=json.dumps({"status": old_status}),
        new_values=json.dumps({"status": "Terminated"}),
        ip_address=request.remote_addr,
        endpoint=f"/api/v1/contracts/{contract_id}",
        http_method="DELETE",
        success=True,
    )
    db.session.add(log)
    db.session.commit()
    return jsonify({"message": "Contract terminated successfully"})


# ── Milestones ──────────────────────────────────────────────────────────────

@api_v1_bp.route("/contracts/<string:contract_id>/milestones", methods=["GET"])
@require_auth
def list_milestones(contract_id):
    contract = Contract.query.get_or_404(contract_id)
    return jsonify([m.to_dict() for m in contract.milestones.order_by(ContractMilestone.planned_date)])


@api_v1_bp.route("/contracts/<string:contract_id>/milestones", methods=["POST"])
@require_auth
@require_permission("contracts", "update")
def add_milestone(contract_id):
    Contract.query.get_or_404(contract_id)
    data = request.get_json()
    milestone = ContractMilestone(
        contract_id=contract_id,
        title=data["title"],
        description=data.get("description"),
        planned_date=date.fromisoformat(data["planned_date"]),
        milestone_type=data.get("milestone_type"),
        linked_payment_amount=data.get("linked_payment_amount"),
        created_by_id=g.current_user.id,
    )
    db.session.add(milestone)
    db.session.commit()
    return jsonify(milestone.to_dict()), 201


@api_v1_bp.route("/contracts/<string:contract_id>/milestones/<string:milestone_id>", methods=["PUT"])
@require_auth
@require_permission("contracts", "update")
def update_milestone(contract_id, milestone_id):
    milestone = ContractMilestone.query.filter_by(
        id=milestone_id, contract_id=contract_id
    ).first_or_404()
    data = request.get_json()
    for field in ["title", "description", "completion_percentage", "status", "milestone_type"]:
        if field in data:
            setattr(milestone, field, data[field])
    if "actual_date" in data and data["actual_date"]:
        milestone.actual_date = date.fromisoformat(data["actual_date"])
    db.session.commit()
    return jsonify(milestone.to_dict())


# ── Amendments ──────────────────────────────────────────────────────────────

@api_v1_bp.route("/contracts/<string:contract_id>/amendments", methods=["GET"])
@require_auth
def list_amendments(contract_id):
    contract = Contract.query.get_or_404(contract_id)
    return jsonify([a.to_dict() for a in contract.amendments])


@api_v1_bp.route("/contracts/<string:contract_id>/amendments", methods=["POST"])
@require_auth
@require_permission("contracts", "update")
def create_amendment(contract_id):
    Contract.query.get_or_404(contract_id)
    data = request.get_json()

    # Generate amendment number
    count = ContractAmendment.query.filter_by(contract_id=contract_id).count()
    amendment_no = f"AMD-{count + 1:03d}"

    amendment = ContractAmendment(
        contract_id=contract_id,
        amendment_no=amendment_no,
        amendment_type=data.get("amendment_type"),
        description=data["description"],
        justification=data.get("justification"),
        old_value=json.dumps(data.get("old_value", {})),
        new_value=json.dumps(data.get("new_value", {})),
        value_change=data.get("value_change"),
        time_extension_days=data.get("time_extension_days"),
        new_end_date=date.fromisoformat(data["new_end_date"]) if data.get("new_end_date") else None,
        status="Pending",
        created_by_id=g.current_user.id,
    )
    db.session.add(amendment)
    db.session.commit()
    return jsonify(amendment.to_dict()), 201


# ── Renewals ─────────────────────────────────────────────────────────────────

@api_v1_bp.route("/contracts/<string:contract_id>/renewals", methods=["GET"])
@require_auth
def list_renewals(contract_id):
    contract = Contract.query.get_or_404(contract_id)
    return jsonify([r.to_dict() for r in contract.renewals])


@api_v1_bp.route("/contracts/<string:contract_id>/renewals", methods=["POST"])
@require_auth
@require_permission("contracts", "update")
def initiate_renewal(contract_id):
    Contract.query.get_or_404(contract_id)
    data = request.get_json()

    count = ContractRenewal.query.filter_by(contract_id=contract_id).count()
    renewal = ContractRenewal(
        contract_id=contract_id,
        renewal_no=f"RNW-{count + 1:03d}",
        renewal_period_value=data.get("renewal_period_value"),
        renewal_period_unit=data.get("renewal_period_unit", "Months"),
        new_end_date=date.fromisoformat(data["new_end_date"]) if data.get("new_end_date") else None,
        new_value=data.get("new_value"),
        status="Initiated",
        initiated_by_id=g.current_user.id,
    )
    db.session.add(renewal)
    db.session.commit()
    return jsonify(renewal.to_dict()), 201


@api_v1_bp.route("/contracts/pbg-emd-alerts", methods=["GET"])
@require_auth
def pbg_emd_alerts():
    """Retrieve security deposits, performance BGs and EMD tracking lists with alert tags"""
    contracts = Contract.query.filter_by(sd_bg_required=True).all()
    today = date.today()
    
    alerts = []
    for c in contracts:
        if not c.bg_expiry_date:
            continue
        days = (c.bg_expiry_date - today).days
        alert_level = "Normal"
        if days < 30:
            alert_level = "Critical"
        elif days < 60:
            alert_level = "Urgent"
            
        alerts.append({
            "id": c.id,
            "contract_no": c.contract_no,
            "name": c.name,
            "sd_bg_amount": float(c.sd_bg_amount) if c.sd_bg_amount else 0,
            "bg_expiry_date": c.bg_expiry_date.isoformat(),
            "days_left": days,
            "alert_level": alert_level,
            "status": "Expired" if days < 0 else "Active"
        })
        
    return jsonify(alerts)


@api_v1_bp.route("/contracts/<string:contract_id>/obligations", methods=["GET"])
@require_auth
def list_obligations(contract_id):
    """List statutory obligations for a given contract"""
    from ...models.contract import Contract
    contract = Contract.query.get_or_404(contract_id)
    return jsonify([o.to_dict() for o in contract.obligations])


@api_v1_bp.route("/contracts/<string:contract_id>/obligations", methods=["POST"])
@require_auth
@require_permission("contracts", "update")
def create_obligation(contract_id):
    """Add a new statutory obligation checklist item to a contract"""
    from ...models.contract import Contract, ContractObligation
    from datetime import date
    Contract.query.get_or_404(contract_id)
    data = request.get_json() or {}
    
    if not data.get("title") or not data.get("due_date"):
        return jsonify({"error": "Title and due_date are required"}), 400
        
    obligation = ContractObligation(
        contract_id=contract_id,
        title=data["title"],
        description=data.get("description"),
        due_date=date.fromisoformat(data["due_date"]),
        status=data.get("status", "Pending"),
        obligation_type=data.get("obligation_type", "Statutory"),
        remarks=data.get("remarks"),
        created_by_id=g.current_user.id
    )
    db.session.add(obligation)
    db.session.commit()
    return jsonify(obligation.to_dict()), 201


@api_v1_bp.route("/contracts/<string:contract_id>/obligations/<string:obligation_id>", methods=["PUT"])
@require_auth
@require_permission("contracts", "update")
def update_obligation(contract_id, obligation_id):
    """Update statutory obligation status, completion date, and remarks"""
    from ...models.contract import ContractObligation
    from datetime import date
    obligation = ContractObligation.query.filter_by(contract_id=contract_id, id=obligation_id).first_or_404()
    data = request.get_json() or {}
    
    if "title" in data:
        obligation.title = data["title"]
    if "description" in data:
        obligation.description = data["description"]
    if "due_date" in data:
        obligation.due_date = date.fromisoformat(data["due_date"])
    if "completed_date" in data:
        obligation.completed_date = date.fromisoformat(data["completed_date"]) if data["completed_date"] else None
    if "status" in data:
        obligation.status = data["status"]
    if "obligation_type" in data:
        obligation.obligation_type = data["obligation_type"]
    if "remarks" in data:
        obligation.remarks = data["remarks"]
        
    db.session.commit()
    return jsonify(obligation.to_dict())


@api_v1_bp.route("/contracts/<string:contract_id>/obligations/<string:obligation_id>", methods=["DELETE"])
@require_auth
@require_permission("contracts", "update")
def delete_obligation(contract_id, obligation_id):
    """Remove a statutory obligation item"""
    from ...models.contract import ContractObligation
    obligation = ContractObligation.query.filter_by(contract_id=contract_id, id=obligation_id).first_or_404()
    db.session.delete(obligation)
    db.session.commit()
    return jsonify({"message": "Obligation deleted successfully"})

