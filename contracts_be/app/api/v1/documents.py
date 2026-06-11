"""
Stub API files — Document, Notes, Reports, Awards, Admin
"""
from flask import request, jsonify, g, current_app
import os
from werkzeug.utils import secure_filename
from . import api_v1_bp
from ...extensions import db
from ...models.document import Document, DocumentVersion
from ...models.note import NoteSheet, NoteEntry
from ...models.audit import AuditLog
from ...models.user import User, Role
from ...utils.decorators import require_auth, require_permission
from datetime import datetime
import uuid, hashlib


# ──────────────────────────────────────────────────────────────────────────────
# DOCUMENT MANAGEMENT
# ──────────────────────────────────────────────────────────────────────────────

@api_v1_bp.route("/documents/<string:ref_type>/<string:ref_id>", methods=["GET"])
@require_auth
def list_documents(ref_type, ref_id):
    docs = Document.query.filter_by(ref_id=ref_id, ref_type=ref_type, is_latest=True).all()
    return jsonify([d.to_dict() for d in docs])


@api_v1_bp.route("/documents/upload", methods=["POST"])
@require_auth
@require_permission("documents", "create")
def upload_document():
    ref_id = request.form.get("ref_id")
    ref_type = request.form.get("ref_type")
    doc_type = request.form.get("doc_type", "General")
    title = request.form.get("title", "Untitled")

    if not ref_id or not ref_type:
        return jsonify({"error": "ref_id and ref_type required"}), 400

    file = request.files.get("file")
    if not file or not file.filename:
        return jsonify({"error": "No file provided"}), 400

    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    allowed = current_app.config.get("ALLOWED_EXTENSIONS", {"pdf", "doc", "docx", "xls", "xlsx"})
    if ext not in allowed:
        return jsonify({"error": f"File type .{ext} not allowed"}), 400

    # Secure storage path
    upload_dir = os.path.join(current_app.config["UPLOAD_FOLDER"], ref_type, ref_id)
    os.makedirs(upload_dir, exist_ok=True)

    stored_name = f"{uuid.uuid4().hex}.{ext}"
    storage_path = os.path.join(upload_dir, stored_name)
    file.save(storage_path)

    # Compute checksum
    with open(storage_path, "rb") as f:
        checksum = hashlib.sha256(f.read()).hexdigest()

    file_size = os.path.getsize(storage_path)

    document = Document(
        ref_id=ref_id,
        ref_type=ref_type,
        doc_type=doc_type,
        title=title,
        description=request.form.get("description"),
        original_filename=secure_filename(file.filename),
        stored_filename=stored_name,
        storage_path=storage_path,
        file_size=file_size,
        file_extension=ext,
        checksum=checksum,
        version=1,
        is_latest=True,
        uploaded_by_id=g.current_user.id,
    )
    db.session.add(document)
    db.session.commit()
    return jsonify(document.to_dict()), 201


@api_v1_bp.route("/documents/<string:doc_id>/download", methods=["GET"])
@require_auth
def download_document(doc_id):
    from flask import send_file
    doc = Document.query.get_or_404(doc_id)
    if not os.path.exists(doc.storage_path):
        return jsonify({"error": "File not found on server"}), 404
    return send_file(doc.storage_path, as_attachment=True, download_name=doc.original_filename)


# ──────────────────────────────────────────────────────────────────────────────
# eOFFICE NOTE SHEETS
# ──────────────────────────────────────────────────────────────────────────────

@api_v1_bp.route("/notes", methods=["GET"])
@require_auth
def list_note_sheets():
    contract_id = request.args.get("contract_id")
    status = request.args.get("status")
    query = NoteSheet.query
    if contract_id:
        query = query.filter_by(contract_id=contract_id)
    if status:
        query = query.filter_by(status=status)
    notes = query.order_by(NoteSheet.created_at.desc()).limit(50).all()
    return jsonify([n.to_dict() for n in notes])


@api_v1_bp.route("/notes", methods=["POST"])
@require_auth
@require_permission("notes", "create")
def create_note_sheet():
    data = request.get_json()
    count = NoteSheet.query.count()
    file_no = data.get("file_no", f"ERLDC/NS/{datetime.utcnow().year}/{count + 1:04d}")
    note = NoteSheet(
        contract_id=data.get("contract_id"),
        tender_id=data.get("tender_id"),
        file_no=file_no,
        subject=data["subject"],
        note_type=data.get("note_type"),
        priority=data.get("priority", "Normal"),
        created_by_id=g.current_user.id,
        current_with_id=g.current_user.id,
        status="Draft",
    )
    db.session.add(note)
    db.session.commit()
    return jsonify(note.to_dict(include_entries=True)), 201


@api_v1_bp.route("/notes/<string:note_id>", methods=["GET"])
@require_auth
def get_note_sheet(note_id):
    note = NoteSheet.query.get_or_404(note_id)
    return jsonify(note.to_dict(include_entries=True))


@api_v1_bp.route("/notes/<string:note_id>/entries", methods=["POST"])
@require_auth
def add_note_entry(note_id):
    note = NoteSheet.query.get_or_404(note_id)
    data = request.get_json()
    entry = NoteEntry(
        note_sheet_id=note_id,
        author_id=g.current_user.id,
        content=data["content"],
        action=data.get("action", "Noted"),
        forwarded_to_id=data.get("forwarded_to_id"),
    )
    db.session.add(entry)
    if data.get("forwarded_to_id"):
        note.current_with_id = data["forwarded_to_id"]
        note.status = "In Movement"
    if data.get("action") in ["Approved", "Rejected"]:
        note.status = data["action"]
    db.session.commit()
    return jsonify(entry.to_dict()), 201


# ──────────────────────────────────────────────────────────────────────────────
# REPORTS
# ──────────────────────────────────────────────────────────────────────────────

@api_v1_bp.route("/reports/contract-register", methods=["GET"])
@require_auth
def contract_register():
    from ...models.contract import Contract
    contracts = Contract.query.order_by(Contract.department, Contract.contract_no).all()
    return jsonify([c.to_dict() for c in contracts])


@api_v1_bp.route("/reports/expiry-register", methods=["GET"])
@require_auth
def expiry_register():
    from ...models.contract import Contract
    from datetime import date
    today = date.today()
    contracts = Contract.query.filter(
        Contract.end_date >= today,
        Contract.status.notin_(["Terminated", "Completed"])
    ).order_by(Contract.end_date.asc()).all()
    return jsonify([c.to_dict() for c in contracts])


@api_v1_bp.route("/reports/audit-trail", methods=["GET"])
@require_auth
@require_permission("reports", "read")
def audit_trail():
    entity_type = request.args.get("entity_type")
    entity_id = request.args.get("entity_id")
    user_id = request.args.get("user_id")
    page = request.args.get("page", 1, type=int)
    per_page = min(request.args.get("per_page", 50, type=int), 200)

    query = AuditLog.query
    if entity_type:
        query = query.filter_by(entity_type=entity_type)
    if entity_id:
        query = query.filter_by(entity_id=entity_id)
    if user_id:
        query = query.filter_by(user_id=user_id)
    query = query.order_by(AuditLog.created_at.desc())
    paginated = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "logs": [log.to_dict() for log in paginated.items],
        "pagination": {"page": page, "per_page": per_page, "total": paginated.total}
    })


# ──────────────────────────────────────────────────────────────────────────────
# AWARD MANAGEMENT
# ──────────────────────────────────────────────────────────────────────────────

@api_v1_bp.route("/awards", methods=["GET"])
@require_auth
def list_awards():
    from ...models.award import Award
    awards = Award.query.order_by(Award.award_date.desc()).limit(50).all()
    return jsonify([a.to_dict() for a in awards])


@api_v1_bp.route("/awards", methods=["POST"])
@require_auth
@require_permission("awards", "create")
def create_award():
    from ...models.award import Award, LOA
    from ...models.vendor import Vendor
    from datetime import date
    data = request.get_json() or {}
    
    vendor_id = data.get("vendor_id")
    if vendor_id:
        vendor = Vendor.query.get(vendor_id)
        if vendor and vendor.status == "Blacklisted":
            return jsonify({"error": f"Cannot create award: Vendor '{vendor.name}' is blacklisted due to: {vendor.blacklist_reason or 'No reason provided'}"}), 400

    award = Award(
        tender_id=data["tender_id"],
        vendor_id=data["vendor_id"],
        awarded_amount=data["awarded_amount"],
        award_date=date.fromisoformat(data["award_date"]),
        award_basis=data.get("award_basis", "L1"),
        status="Pending",
        created_by_id=g.current_user.id,
    )
    db.session.add(award)
    db.session.commit()
    return jsonify(award.to_dict()), 201


# ──────────────────────────────────────────────────────────────────────────────
# ADMIN (RBAC)
# ──────────────────────────────────────────────────────────────────────────────

@api_v1_bp.route("/admin/roles", methods=["GET"])
@require_auth
@require_permission("admin", "read")
def list_roles():
    roles = Role.query.all()
    return jsonify([r.to_dict() for r in roles])


@api_v1_bp.route("/admin/users", methods=["GET"])
@require_auth
@require_permission("admin", "read")
def list_users():
    users = User.query.filter_by(is_active=True).order_by(User.name).all()
    return jsonify([u.to_dict(include_role=True) for u in users])


@api_v1_bp.route("/admin/users/<string:user_id>/role", methods=["PUT"])
@require_auth
@require_permission("admin", "update")
def assign_role(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    role = Role.query.filter_by(name=data["role_name"]).first()
    if not role:
        return jsonify({"error": "Role not found"}), 404
    user.role_id = role.id
    db.session.commit()
    return jsonify(user.to_dict(include_role=True))


@api_v1_bp.route("/ai/compare-clauses", methods=["POST"])
@require_auth
def compare_clauses():
    """AI-powered clause compliance checker comparing custom drafts against standard ERLDC procurement benchmarks"""
    data = request.get_json() or {}
    draft_text = data.get("draft_text", "")
    clause_type = data.get("clause_type", "Force Majeure")
    
    if not draft_text:
        return jsonify({"error": "draft_text required"}), 400
        
    api_key = current_app.config.get("OPENAI_API_KEY")
    if api_key:
        try:
            import json as pyjson
            # Use live OpenAI completion
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            prompt = f"""
            Analyze the following contract draft clause of type '{clause_type}' against ERLDC Standard Procurement benchmarks.
            
            Draft Clause Text:
            "{draft_text}"
            
            Return a JSON object containing:
            1. 'match_percentage' (integer 0-100)
            2. 'risk_level' ('Low', 'Medium', 'High')
            3. 'missing_aspects' (list of strings explaining what ERLDC requirements are missing)
            4. 'recommendation' (string explaining how to improve compliance)
            """
            
            resp = requests.post(
                "https://api.openai.com/v1/chat/completions",
                headers=headers,
                json={
                    "model": current_app.config.get("OPENAI_MODEL", "gpt-4o-mini"),
                    "messages": [{"role": "user", "content": prompt}],
                    "response_format": {"type": "json_object"}
                },
                timeout=15
            )
            ai_data = resp.json()
            analysis = pyjson.loads(ai_data["choices"][0]["message"]["content"])
            return jsonify(analysis)
        except Exception as e:
            # Fallback to local rule engine if OpenAI fails
            pass
            
    # Local Rule-based fallback comparator
    compliance_score = 100
    missing = []
    risk = "Low"
    recommendation = "Draft matches ERLDC standards."
    
    text_lower = draft_text.lower()
    
    if clause_type == "Force Majeure":
        required = ["act of god", "war", "riot", "strike", "notice within"]
        for keyword in required:
            if keyword not in text_lower:
                compliance_score -= 15
                missing.append(f"Missing explicit mention of '{keyword}' condition")
        if "notice" not in text_lower:
            compliance_score -= 20
            missing.append("No notification timeline or timeline limit (e.g. 10 days) specified")
            
    elif clause_type == "Liquidated Damages":
        required = ["percent", "delay", "maximum", "limit", "weeks"]
        for keyword in required:
            if keyword not in text_lower:
                compliance_score -= 15
                missing.append(f"Missing '{keyword}' definition")
        if "maximum" not in text_lower or "limit" not in text_lower:
            compliance_score -= 25
            missing.append("Upper bound capping limit (e.g., max 10% of contract value) is missing")
            
    elif clause_type == "Arbitration":
        required = ["sole arbitrator", "venue", "delhi", "arbitration and conciliation act"]
        for keyword in required:
            if keyword not in text_lower:
                compliance_score -= 20
                missing.append(f"Missing mandatory ERLDC condition: '{keyword}'")
                
    # Determine risk level based on compliance
    if compliance_score < 60:
        risk = "High"
        recommendation = "Critical deviations found. Restructure the clause to incorporate standard ERLDC benchmarks."
    elif compliance_score < 85:
        risk = "Medium"
        recommendation = "Minor issues. Add missing timelines and reference standard legal acts."
        
    return jsonify({
        "match_percentage": max(0, compliance_score),
        "risk_level": risk,
        "missing_aspects": missing,
        "recommendation": recommendation
    })

