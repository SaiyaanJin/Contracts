"""
Global Search API
"""
from flask import request, jsonify
from sqlalchemy import or_

from . import api_v1_bp
from ...models.contract import Contract
from ...models.tender import Tender
from ...models.vendor import Vendor
from ...models.invoice import Invoice
from ...utils.decorators import require_auth


@api_v1_bp.route("/search", methods=["GET"])
@require_auth
def global_search():
    """
    Global full-text search across contracts, tenders, vendors, invoices.
    Query param: q (search term)
    """
    q = request.args.get("q", "").strip()
    if not q or len(q) < 2:
        return jsonify({"error": "Search query must be at least 2 characters"}), 400

    results = {
        "contracts": [],
        "tenders": [],
        "vendors": [],
        "invoices": [],
    }

    # Search contracts
    contracts = Contract.query.filter(or_(
        Contract.name.ilike(f"%{q}%"),
        Contract.contract_no.ilike(f"%{q}%"),
        Contract.file_no.ilike(f"%{q}%"),
        Contract.gem_contract_no.ilike(f"%{q}%"),
        Contract.eic.ilike(f"%{q}%"),
        Contract.short_description.ilike(f"%{q}%"),
    )).limit(10).all()

    results["contracts"] = [
        {"id": c.id, "label": c.name, "sub": c.contract_no, "type": "contract",
         "department": c.department, "status": c.computed_status()}
        for c in contracts
    ]

    # Search tenders
    tenders = Tender.query.filter(or_(
        Tender.title.ilike(f"%{q}%"),
        Tender.gem_bid_no.ilike(f"%{q}%"),
        Tender.tender_no.ilike(f"%{q}%"),
    )).limit(10).all()

    results["tenders"] = [
        {"id": t.id, "label": t.title, "sub": t.tender_no, "type": "tender",
         "department": t.department, "status": t.status}
        for t in tenders
    ]

    # Search vendors
    vendors = Vendor.query.filter(or_(
        Vendor.name.ilike(f"%{q}%"),
        Vendor.gstin.ilike(f"%{q}%"),
        Vendor.pan.ilike(f"%{q}%"),
        Vendor.vendor_code.ilike(f"%{q}%"),
    )).limit(10).all()

    results["vendors"] = [
        {"id": v.id, "label": v.name, "sub": v.vendor_code, "type": "vendor",
         "city": v.city, "status": v.status}
        for v in vendors
    ]

    # Search invoices
    invoices = Invoice.query.filter(or_(
        Invoice.invoice_no.ilike(f"%{q}%"),
        Invoice.vendor_invoice_no.ilike(f"%{q}%"),
    )).limit(5).all()

    results["invoices"] = [
        {"id": i.id, "label": i.invoice_no, "sub": i.vendor_invoice_no, "type": "invoice",
         "status": i.status}
        for i in invoices
    ]

    total = sum(len(v) for v in results.values())
    return jsonify({"query": q, "total": total, "results": results})
