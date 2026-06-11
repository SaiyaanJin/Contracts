"""
Workflow Engine API
"""
import json
from flask import request, jsonify, g
from datetime import datetime, timedelta

from . import api_v1_bp
from ...extensions import db
from ...models.workflow import Workflow, WorkflowStep, Approval
from ...models.notification import Notification
from ...utils.decorators import require_auth, require_permission

# Default workflow templates
WORKFLOW_TEMPLATES = {
    "contract_initiation": [
        {"step": 1, "name": "Section Officer Review", "role": "section_officer", "sla_hours": 48},
        {"step": 2, "name": "Manager Approval", "role": "manager", "sla_hours": 48},
        {"step": 3, "name": "GM Approval", "role": "gm", "sla_hours": 72},
        {"step": 4, "name": "Executive Director", "role": "executive_director", "sla_hours": 72},
    ],
    "tender_approval": [
        {"step": 1, "name": "Legal Vetting", "role": "legal", "sla_hours": 48},
        {"step": 2, "name": "Technical Vetting", "role": "manager", "sla_hours": 48},
        {"step": 3, "name": "Finance Vetting", "role": "finance", "sla_hours": 48},
        {"step": 4, "name": "Competent Authority Approval", "role": "approver", "sla_hours": 72},
    ],
    "invoice_approval": [
        {"step": 1, "name": "EIC Verification", "role": "initiator", "sla_hours": 24},
        {"step": 2, "name": "SDAC Processing", "role": "purchase", "sla_hours": 24},
        {"step": 3, "name": "Finance Approval", "role": "finance", "sla_hours": 48},
    ],
    "award_approval": [
        {"step": 1, "name": "TC Recommendation", "role": "manager", "sla_hours": 48},
        {"step": 2, "name": "GM Approval", "role": "gm", "sla_hours": 48},
        {"step": 3, "name": "Competent Authority", "role": "approver", "sla_hours": 72},
    ],
}


@api_v1_bp.route("/workflows", methods=["POST"])
@require_auth
def create_workflow():
    """Initiate a new workflow for an entity"""
    data = request.get_json()
    template_name = data.get("template_name")
    entity_type = data.get("entity_type")
    entity_id = data.get("entity_id")

    if not all([template_name, entity_type, entity_id]):
        return jsonify({"error": "template_name, entity_type, entity_id required"}), 400

    steps_config = WORKFLOW_TEMPLATES.get(template_name, [])

    workflow = Workflow(
        template_name=template_name,
        entity_type=entity_type,
        entity_id=entity_id,
        status="In Progress",
        current_step=1,
        total_steps=len(steps_config),
        steps_config=json.dumps(steps_config),
        initiated_by_id=g.current_user.id,
    )
    db.session.add(workflow)
    db.session.flush()

    now = datetime.utcnow()
    for step_cfg in steps_config:
        step = WorkflowStep(
            workflow_id=workflow.id,
            step_number=step_cfg["step"],
            step_name=step_cfg["name"],
            assigned_role=step_cfg["role"],
            sla_hours=step_cfg.get("sla_hours", 48),
            due_date=now + timedelta(hours=step_cfg.get("sla_hours", 48)) if step_cfg["step"] == 1 else None,
            status="Pending" if step_cfg["step"] > 1 else "In Progress",
        )
        db.session.add(step)

    db.session.commit()
    return jsonify(workflow.to_dict()), 201


@api_v1_bp.route("/workflows/<string:workflow_id>", methods=["GET"])
@require_auth
def get_workflow(workflow_id):
    wf = Workflow.query.get_or_404(workflow_id)
    return jsonify(wf.to_dict())


@api_v1_bp.route("/workflows/<string:workflow_id>/approve", methods=["POST"])
@require_auth
def approve_workflow_step(workflow_id):
    """Approve/Reject current workflow step"""
    wf = Workflow.query.get_or_404(workflow_id)
    data = request.get_json()
    action = data.get("action")  # Approved, Rejected, Returned

    if action not in ["Approved", "Rejected", "Returned"]:
        return jsonify({"error": "action must be: Approved, Rejected, or Returned"}), 400

    # Get current step
    current_step = WorkflowStep.query.filter_by(
        workflow_id=workflow_id,
        step_number=wf.current_step
    ).first()

    if not current_step:
        return jsonify({"error": "No active step found"}), 400

    # Record approval
    approval = Approval(
        workflow_id=workflow_id,
        step_id=current_step.id,
        approver_id=g.current_user.id,
        action=action,
        comments=data.get("comments"),
    )
    db.session.add(approval)

    current_step.status = action
    current_step.completed_at = datetime.utcnow()

    if action == "Approved":
        # Move to next step
        next_step = WorkflowStep.query.filter_by(
            workflow_id=workflow_id,
            step_number=wf.current_step + 1
        ).first()

        if next_step:
            next_step.status = "In Progress"
            next_step.due_date = datetime.utcnow() + timedelta(hours=next_step.sla_hours)
            wf.current_step += 1
        else:
            # All steps complete
            wf.status = "Approved"
            wf.completed_at = datetime.utcnow()
    elif action in ["Rejected", "Returned"]:
        wf.status = "Rejected" if action == "Rejected" else "Returned"
        wf.completed_at = datetime.utcnow()

    db.session.commit()
    return jsonify(wf.to_dict())


@api_v1_bp.route("/workflows/pending", methods=["GET"])
@require_auth
def my_pending_workflows():
    """Get workflows pending action by current user's role"""
    role_name = g.current_user.role.name if g.current_user.role else None
    if not role_name:
        return jsonify([])

    pending_steps = WorkflowStep.query.filter_by(
        assigned_role=role_name,
        status="In Progress"
    ).all()

    result = []
    for step in pending_steps:
        wf = step.workflow
        if wf and wf.status == "In Progress":
            result.append({
                "workflow": wf.to_dict(),
                "step": step.to_dict(),
            })

    return jsonify(result)
