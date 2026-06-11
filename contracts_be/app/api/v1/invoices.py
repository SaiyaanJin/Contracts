"""
Invoice Management API
"""
from datetime import date
from flask import request, jsonify, g

from . import api_v1_bp
from ...extensions import db
from ...models.invoice import Invoice, InvoiceItem
from ...models.payment import Payment
from ...utils.decorators import require_auth, require_permission


@api_v1_bp.route("/invoices", methods=["GET"])
@require_auth
def list_invoices():
    page = request.args.get("page", 1, type=int)
    per_page = min(request.args.get("per_page", 20, type=int), 100)
    contract_id = request.args.get("contract_id")
    vendor_id = request.args.get("vendor_id")
    status = request.args.get("status")

    query = Invoice.query
    if contract_id:
        query = query.filter_by(contract_id=contract_id)
    if vendor_id:
        query = query.filter_by(vendor_id=vendor_id)
    if status:
        query = query.filter_by(status=status)

    query = query.order_by(Invoice.invoice_date.desc())
    paginated = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "invoices": [i.to_dict() for i in paginated.items],
        "pagination": {
            "page": page, "per_page": per_page,
            "total": paginated.total, "pages": paginated.pages,
        }
    })


@api_v1_bp.route("/invoices/<string:invoice_id>", methods=["GET"])
@require_auth
def get_invoice(invoice_id):
    invoice = Invoice.query.get_or_404(invoice_id)
    data = invoice.to_dict(include_items=True)
    data["payments"] = [p.to_dict() for p in invoice.payments]
    return jsonify(data)


@api_v1_bp.route("/invoices", methods=["POST"])
@require_auth
@require_permission("invoices", "create")
def submit_invoice():
    data = request.get_json()
    required = ["contract_id", "vendor_id", "invoice_no", "invoice_amount", "invoice_date"]
    missing = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"error": f"Missing: {', '.join(missing)}"}), 400

    # Generate internal invoice number
    count = Invoice.query.count()
    internal_no = f"INV-{count + 1:06d}"

    net_payable = (
        float(data.get("invoice_amount", 0)) +
        float(data.get("gst_amount", 0) or 0) -
        float(data.get("tds_amount", 0) or 0) -
        float(data.get("penalty_deduction", 0) or 0) -
        float(data.get("retention_amount", 0) or 0)
    )

    invoice = Invoice(
        contract_id=data["contract_id"],
        vendor_id=data["vendor_id"],
        invoice_no=internal_no,
        vendor_invoice_no=data.get("invoice_no"),
        bill_type=data.get("bill_type", "Running Bill"),
        invoice_amount=data["invoice_amount"],
        gst_amount=data.get("gst_amount"),
        tds_amount=data.get("tds_amount"),
        penalty_deduction=data.get("penalty_deduction", 0),
        retention_amount=data.get("retention_amount", 0),
        net_payable=net_payable,
        invoice_date=date.fromisoformat(data["invoice_date"]),
        received_date=date.today(),
        due_date=date.fromisoformat(data["due_date"]) if data.get("due_date") else None,
        bill_no=data.get("bill_no"),
        milestone_id=data.get("milestone_id"),
        status="Submitted",
        created_by_id=g.current_user.id,
    )
    db.session.add(invoice)

    # Add line items
    for item_data in data.get("items", []):
        item = InvoiceItem(
            invoice_id=invoice.id,
            description=item_data["description"],
            quantity=item_data.get("quantity"),
            unit=item_data.get("unit"),
            unit_rate=item_data.get("unit_rate"),
            amount=item_data["amount"],
            hsn_sac_code=item_data.get("hsn_sac_code"),
            gst_percentage=item_data.get("gst_percentage"),
        )
        db.session.add(item)

    db.session.commit()
    return jsonify(invoice.to_dict(include_items=True)), 201


@api_v1_bp.route("/invoices/<string:invoice_id>/verify", methods=["POST"])
@require_auth
@require_permission("invoices", "update")
def verify_invoice(invoice_id):
    invoice = Invoice.query.get_or_404(invoice_id)
    data = request.get_json()
    invoice.status = "Under Verification"
    invoice.verified_by_id = g.current_user.id
    invoice.verified_date = date.today()
    invoice.verification_remarks = data.get("remarks")
    if data.get("verified"):
        invoice.status = "SDAC"
    db.session.commit()
    return jsonify(invoice.to_dict())


@api_v1_bp.route("/invoices/<string:invoice_id>/sdac", methods=["POST"])
@require_auth
@require_permission("invoices", "update")
def process_sdac(invoice_id):
    invoice = Invoice.query.get_or_404(invoice_id)
    data = request.get_json()
    invoice.sdac_processed = True
    invoice.sdac_processed_by_id = g.current_user.id
    invoice.sdac_date = date.today()
    invoice.sdac_remarks = data.get("remarks")
    invoice.status = "Finance Approval"
    db.session.commit()
    return jsonify(invoice.to_dict())


@api_v1_bp.route("/invoices/<string:invoice_id>/finance-approve", methods=["POST"])
@require_auth
@require_permission("invoices", "approve")
def finance_approve_invoice(invoice_id):
    invoice = Invoice.query.get_or_404(invoice_id)
    data = request.get_json()
    invoice.finance_approved = data.get("approved", True)
    invoice.finance_approved_by_id = g.current_user.id
    from datetime import datetime
    invoice.finance_approval_date = datetime.utcnow()
    invoice.finance_remarks = data.get("remarks")
    invoice.status = "Payment Order" if invoice.finance_approved else "Rejected"
    db.session.commit()
    return jsonify(invoice.to_dict())


# ── Payments ─────────────────────────────────────────────────────────────────

@api_v1_bp.route("/payments", methods=["GET"])
@require_auth
def list_payments():
    page = request.args.get("page", 1, type=int)
    per_page = min(request.args.get("per_page", 20, type=int), 100)
    status = request.args.get("status")

    query = Payment.query
    if status:
        query = query.filter_by(status=status)
    query = query.order_by(Payment.created_at.desc())
    paginated = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "payments": [p.to_dict() for p in paginated.items],
        "pagination": {"page": page, "per_page": per_page, "total": paginated.total}
    })


@api_v1_bp.route("/payments", methods=["POST"])
@require_auth
@require_permission("payments", "create")
def create_payment():
    data = request.get_json()
    invoice = Invoice.query.get_or_404(data.get("invoice_id"))

    count = Payment.query.count()
    po_no = f"PO-PAY-{count + 1:06d}"

    payment = Payment(
        invoice_id=invoice.id,
        contract_id=invoice.contract_id,
        vendor_id=invoice.vendor_id,
        payment_order_no=po_no,
        payment_amount=data.get("payment_amount", invoice.net_payable),
        payment_mode=data.get("payment_mode"),
        bank_name=data.get("bank_name"),
        bank_account_no=data.get("bank_account_no"),
        bank_ifsc=data.get("bank_ifsc"),
        utr_no=data.get("utr_no"),
        payment_date=date.fromisoformat(data["payment_date"]) if data.get("payment_date") else None,
        status="Pending",
        remarks=data.get("remarks"),
        created_by_id=g.current_user.id,
    )
    db.session.add(payment)
    invoice.status = "Payment Order"
    db.session.commit()
    return jsonify(payment.to_dict()), 201


@api_v1_bp.route("/payments/<string:payment_id>/mark-paid", methods=["POST"])
@require_auth
@require_permission("payments", "update")
def mark_payment_paid(payment_id):
    payment = Payment.query.get_or_404(payment_id)
    data = request.get_json()
    payment.status = "Paid"
    payment.utr_no = data.get("utr_no", payment.utr_no)
    payment.payment_date = date.fromisoformat(data["payment_date"]) if data.get("payment_date") else date.today()
    # Mark invoice as paid
    invoice = Invoice.query.get(payment.invoice_id)
    if invoice:
        invoice.status = "Paid"
    db.session.commit()
    return jsonify(payment.to_dict())
