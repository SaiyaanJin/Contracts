"""
Database Seed Script — Roles, Permissions, Sample Data
Run: flask seed-db
"""
import click
from flask.cli import with_appcontext
from datetime import date, timedelta
from .extensions import db
from .models.user import User, Role, Permission, RolePermission


ROLES = [
    {"name": "admin", "display_name": "System Administrator (IT)", "is_system": True},
    {"name": "initiator", "display_name": "Initiator / Section Officer", "is_system": True},
    {"name": "manager", "display_name": "Manager", "is_system": True},
    {"name": "agm", "display_name": "Assistant General Manager", "is_system": True},
    {"name": "gm", "display_name": "General Manager", "is_system": True},
    {"name": "executive_director", "display_name": "Executive Director", "is_system": True},
    {"name": "finance", "display_name": "Finance & Accounts", "is_system": True},
    {"name": "legal", "display_name": "Legal", "is_system": True},
    {"name": "purchase", "display_name": "Purchase / Contracts & Services", "is_system": True},
    {"name": "approver", "display_name": "Competent Authority", "is_system": True},
    {"name": "vendor", "display_name": "Vendor", "is_system": True},
    {"name": "auditor", "display_name": "Auditor", "is_system": True},
    {"name": "viewer", "display_name": "Viewer (Read Only)", "is_system": True},
    {"name": "section_officer", "display_name": "Section Officer", "is_system": True},
]

PERMISSIONS = [
    # Contracts
    {"name": "contracts:create", "module": "contracts", "action": "create"},
    {"name": "contracts:read", "module": "contracts", "action": "read"},
    {"name": "contracts:update", "module": "contracts", "action": "update"},
    {"name": "contracts:delete", "module": "contracts", "action": "delete"},
    {"name": "contracts:approve", "module": "contracts", "action": "approve"},
    # Tenders
    {"name": "tenders:create", "module": "tenders", "action": "create"},
    {"name": "tenders:read", "module": "tenders", "action": "read"},
    {"name": "tenders:update", "module": "tenders", "action": "update"},
    {"name": "tenders:approve", "module": "tenders", "action": "approve"},
    # Vendors
    {"name": "vendors:create", "module": "vendors", "action": "create"},
    {"name": "vendors:read", "module": "vendors", "action": "read"},
    {"name": "vendors:update", "module": "vendors", "action": "update"},
    # Invoices
    {"name": "invoices:create", "module": "invoices", "action": "create"},
    {"name": "invoices:read", "module": "invoices", "action": "read"},
    {"name": "invoices:update", "module": "invoices", "action": "update"},
    {"name": "invoices:approve", "module": "invoices", "action": "approve"},
    # Payments
    {"name": "payments:create", "module": "payments", "action": "create"},
    {"name": "payments:read", "module": "payments", "action": "read"},
    {"name": "payments:update", "module": "payments", "action": "update"},
    # SLA
    {"name": "sla:create", "module": "sla", "action": "create"},
    {"name": "sla:read", "module": "sla", "action": "read"},
    {"name": "sla:update", "module": "sla", "action": "update"},
    # Documents
    {"name": "documents:create", "module": "documents", "action": "create"},
    {"name": "documents:read", "module": "documents", "action": "read"},
    {"name": "documents:delete", "module": "documents", "action": "delete"},
    # Notes
    {"name": "notes:create", "module": "notes", "action": "create"},
    {"name": "notes:read", "module": "notes", "action": "read"},
    # Reports
    {"name": "reports:read", "module": "reports", "action": "read"},
    {"name": "reports:export", "module": "reports", "action": "export"},
    # Awards
    {"name": "awards:create", "module": "awards", "action": "create"},
    {"name": "awards:read", "module": "awards", "action": "read"},
    # Admin
    {"name": "admin:read", "module": "admin", "action": "read"},
    {"name": "admin:update", "module": "admin", "action": "update"},
]

# Role → Permission mapping
ROLE_PERMISSIONS = {
    "admin": [p["name"] for p in PERMISSIONS],  # All permissions
    "initiator": [
        "contracts:create", "contracts:read", "contracts:update",
        "tenders:read", "vendors:read", "invoices:create", "invoices:read",
        "documents:create", "documents:read", "notes:create", "notes:read",
        "sla:read", "reports:read",
    ],
    "section_officer": [
        "contracts:create", "contracts:read", "contracts:update",
        "tenders:read", "vendors:read", "invoices:create", "invoices:read",
        "documents:create", "documents:read", "notes:create", "notes:read",
        "sla:read", "reports:read",
    ],
    "manager": [
        "contracts:create", "contracts:read", "contracts:update", "contracts:approve",
        "tenders:create", "tenders:read", "tenders:update", "tenders:approve",
        "vendors:create", "vendors:read", "vendors:update",
        "invoices:read", "invoices:update", "invoices:approve",
        "documents:create", "documents:read",
        "notes:create", "notes:read",
        "sla:create", "sla:read", "sla:update",
        "reports:read", "awards:read",
    ],
    "agm": [
        "contracts:read", "contracts:update", "contracts:approve",
        "tenders:read", "tenders:approve",
        "vendors:read", "invoices:read", "invoices:approve",
        "documents:read", "notes:read", "reports:read", "awards:read",
    ],
    "gm": [
        "contracts:read", "contracts:approve",
        "tenders:read", "tenders:approve",
        "vendors:read", "invoices:read", "invoices:approve",
        "documents:read", "notes:read", "reports:read", "awards:create", "awards:read",
    ],
    "executive_director": [
        "contracts:read", "contracts:approve",
        "tenders:read", "tenders:approve",
        "vendors:read", "invoices:read", "invoices:approve",
        "documents:read", "notes:read", "reports:read", "reports:export",
        "awards:create", "awards:read",
    ],
    "approver": [
        "contracts:read", "contracts:approve",
        "tenders:read", "tenders:approve",
        "invoices:read", "invoices:approve",
        "documents:read", "notes:read", "reports:read", "reports:export",
        "awards:create", "awards:read",
    ],
    "finance": [
        "contracts:read", "invoices:read", "invoices:update", "invoices:approve",
        "payments:create", "payments:read", "payments:update",
        "documents:read", "reports:read", "reports:export",
    ],
    "legal": [
        "contracts:read", "tenders:read", "tenders:update",
        "vendors:read", "documents:read", "notes:read", "reports:read",
    ],
    "purchase": [
        "contracts:create", "contracts:read", "contracts:update",
        "tenders:create", "tenders:read", "tenders:update",
        "vendors:create", "vendors:read", "vendors:update",
        "invoices:read", "invoices:update",
        "documents:create", "documents:read",
        "notes:create", "notes:read",
        "sla:create", "sla:read", "sla:update",
        "awards:create", "awards:read",
        "reports:read", "reports:export",
    ],
    "auditor": [
        "contracts:read", "tenders:read", "vendors:read",
        "invoices:read", "payments:read",
        "documents:read", "notes:read",
        "reports:read", "reports:export",
        "admin:read",
    ],
    "viewer": [
        "contracts:read", "tenders:read", "vendors:read",
        "invoices:read", "documents:read", "reports:read",
    ],
    "vendor": [
        "invoices:create", "invoices:read", "documents:read",
    ],
}


def seed_roles_and_permissions():
    """Seed roles and permissions"""
    click.echo("Seeding permissions...")
    perm_map = {}
    for pdata in PERMISSIONS:
        existing = Permission.query.filter_by(name=pdata["name"]).first()
        if not existing:
            p = Permission(
                name=pdata["name"],
                module=pdata["module"],
                action=pdata["action"],
                description=pdata.get("description", ""),
            )
            db.session.add(p)
            db.session.flush()
            perm_map[p.name] = p
        else:
            perm_map[existing.name] = existing

    click.echo("Seeding roles...")
    role_map = {}
    for rdata in ROLES:
        existing = Role.query.filter_by(name=rdata["name"]).first()
        if not existing:
            r = Role(
                name=rdata["name"],
                display_name=rdata["display_name"],
                is_system=rdata.get("is_system", False),
            )
            db.session.add(r)
            db.session.flush()
            role_map[r.name] = r
        else:
            role_map[existing.name] = existing

    click.echo("Assigning permissions to roles...")
    for role_name, perm_names in ROLE_PERMISSIONS.items():
        role = role_map.get(role_name)
        if not role:
            continue
        for perm_name in perm_names:
            perm = perm_map.get(perm_name)
            if not perm:
                continue
            existing = RolePermission.query.filter_by(
                role_id=role.id, permission_id=perm.id
            ).first()
            if not existing:
                rp = RolePermission(role_id=role.id, permission_id=perm.id)
                db.session.add(rp)

    db.session.commit()
    click.echo("[OK] Roles and permissions seeded successfully")


def seed_sample_data():
    """Seed sample contracts, vendors, obligations, and audit logs for demo"""
    from .models.vendor import Vendor
    from .models.contract import Contract, ContractObligation
    from .models.audit import AuditLog
    import uuid
    import json

    # Sample admin user
    admin_role = Role.query.filter_by(name="admin").first()
    if not User.query.filter_by(emp_id="00001").first():
        admin_user = User(
            emp_id="00001",
            username="admin",
            name="System Administrator (IT)",
            email="admin@grid-india.in",
            department="Information Technology",
            role_id=admin_role.id if admin_role else None,
            is_active=True,
        )
        db.session.add(admin_user)
        db.session.flush()

        # Seed Sanjay Kumar (Purchase Manager)
        purchase_role = Role.query.filter_by(name="purchase").first()
        sanjay_user = User(
            emp_id="00162",
            username="00162",
            name="Sanjay Kumar",
            email="sanjay@grid-india.in",
            department="Contracts & Services",
            role_id=purchase_role.id if purchase_role else None,
            is_active=True,
        )
        db.session.add(sanjay_user)
        db.session.flush()

        # Vendor 1: Active
        vendor = Vendor(
            vendor_code="VND-00001",
            name="Tech Solutions Pvt. Ltd.",
            pan="ABCDE1234F",
            gstin="07ABCDE1234F1Z5",
            is_msme=True,
            msme_category="Small",
            contact_person="Rajesh Kumar",
            email="rajesh@techsolutions.in",
            phone="9876543210",
            city="New Delhi",
            state="Delhi",
            annual_turnover=50000000,
            turnover_year="2024-25",
            status="Active",
            created_by_id=admin_user.id,
        )
        db.session.add(vendor)

        # Vendor 2: Watchlist
        vendor2 = Vendor(
            vendor_code="VND-00002",
            name="Global Systems Inc.",
            pan="FGHIJ5678K",
            gstin="27FGHIJ5678K2Z6",
            is_msme=False,
            contact_person="Sarah D Souza",
            email="contact@globalsys.com",
            phone="8877665544",
            city="Mumbai",
            state="Maharashtra",
            annual_turnover=120000000,
            turnover_year="2024-25",
            status="Watchlist",
            blacklist_reason="Frequent delays in SLA resolution and service delivery",
            created_by_id=admin_user.id,
        )
        db.session.add(vendor2)

        # Vendor 3: Blacklisted
        vendor3 = Vendor(
            vendor_code="VND-00003",
            name="Fraudulent Services Ltd.",
            pan="LMNOP1234Q",
            gstin="19LMNOP1234Q1Z1",
            is_msme=False,
            contact_person="Vijay Mallya",
            email="blacklist@fraudulent.com",
            phone="7766554433",
            city="Kolkata",
            state="West Bengal",
            annual_turnover=20000000,
            status="Blacklisted",
            blacklist_reason="Collusive bidding practices flagged by CVC during SCADA procurements",
            blacklist_date=date.today() - timedelta(days=20),
            created_by_id=admin_user.id,
        )
        db.session.add(vendor3)
        db.session.flush()

        # Sample contracts
        sample_contracts = [
            {
                "name": "Annual Maintenance Contract for IT Equipment",
                "department": "Information Technology",
                "contract_type": "Service",
                "procurement_type": "GeM",
                "contract_value": 4500000,
                "end_date": date.today() + timedelta(days=45),
                "eic": "Sh. P.K. Sharma",
                "status": "Active",
                "vendor_id": vendor.id,
                "sd_bg_required": True,
                "sd_bg_amount": 225000.00,
                "bg_expiry_date": date.today() + timedelta(days=120),
            },
            {
                "name": "Network Infrastructure Upgrade",
                "department": "Information Technology",
                "contract_type": "Supply + Service",
                "procurement_type": "GeM",
                "contract_value": 15000000,
                "end_date": date.today() + timedelta(days=180),
                "eic": "Sh. A.K. Singh",
                "status": "Active",
                "vendor_id": vendor.id,
                "sd_bg_required": True,
                "sd_bg_amount": 750000.00,
                "bg_expiry_date": date.today() + timedelta(days=240),
            },
            {
                "name": "Security Surveillance System",
                "department": "System Operation",
                "contract_type": "Supply",
                "procurement_type": "E-Procurement Portal",
                "contract_value": 8000000,
                "end_date": date.today() - timedelta(days=10),
                "eic": "Sh. R.K. Verma",
                "status": "Expired",
                "vendor_id": vendor2.id,
                "sd_bg_required": False,
            },
        ]

        from .services.contract_service import ContractService
        first_contract = None
        for i, cdata in enumerate(sample_contracts):
            contract_no = ContractService.generate_contract_no(cdata["department"])
            c = Contract(
                contract_no=contract_no,
                file_no=f"ERLDC/IT/2024/{i+1:04d}",
                name=cdata["name"],
                department=cdata["department"],
                region="ERLDC",
                contract_type=cdata["contract_type"],
                procurement_type=cdata["procurement_type"],
                contract_value=cdata["contract_value"],
                estimated_value=cdata["contract_value"],
                vendor_id=cdata["vendor_id"],
                award_date=date.today() - timedelta(days=365),
                start_date=date.today() - timedelta(days=365),
                end_date=cdata["end_date"],
                eic=cdata["eic"],
                status=cdata["status"],
                lifecycle_stage="Execution",
                sd_bg_required=cdata["sd_bg_required"],
                sd_bg_amount=cdata.get("sd_bg_amount"),
                bg_expiry_date=cdata.get("bg_expiry_date"),
                created_by_id=admin_user.id,
            )
            db.session.add(c)
            db.session.flush()
            if i == 0:
                first_contract = c

        # Seed Contract Obligations for the first contract
        if first_contract:
            obligations = [
                {
                    "title": "Submit Labor License Details & Registrations",
                    "description": "Statutory labor department clearances for site technicians",
                    "due_date": date.today() + timedelta(days=15),
                    "status": "Approved",
                    "obligation_type": "Labor",
                    "remarks": "Submitted and verified by IT section officer."
                },
                {
                    "title": "Works Insurance & CAR Policy Registration",
                    "description": "Contractors All Risk insurance policy cover proof submission",
                    "due_date": date.today() + timedelta(days=30),
                    "status": "Submitted",
                    "obligation_type": "Insurance",
                    "remarks": "Policy document copy under review by Finance."
                },
                {
                    "title": "Safety Clearance Audit Checklist",
                    "description": "Safety clearance checklist validation for ERLDC control center access",
                    "due_date": date.today() + timedelta(days=10),
                    "status": "Pending",
                    "obligation_type": "Safety",
                    "remarks": "Safety audit scheduled next Tuesday."
                },
                {
                    "title": "MSME Self-Declaration Declaration Form",
                    "description": "Annual declaration of MSME credentials with Udyam Certificate",
                    "due_date": date.today() - timedelta(days=5),
                    "status": "Overdue",
                    "obligation_type": "Statutory",
                    "remarks": "Reminder mail automatically dispatched to vendor."
                }
            ]
            for ob in obligations:
                o = ContractObligation(
                    contract_id=first_contract.id,
                    title=ob["title"],
                    description=ob["description"],
                    due_date=ob["due_date"],
                    status=ob["status"],
                    obligation_type=ob["obligation_type"],
                    remarks=ob["remarks"],
                    created_by_id=admin_user.id
                )
                db.session.add(o)

        # Seed CVC Audit Logs
        audit_logs = [
            {
                "user_name": "System Administrator (IT)",
                "user_emp_id": "00001",
                "user_role": "admin",
                "action": "LOGIN",
                "entity_type": "user",
                "entity_id": admin_user.id,
                "entity_label": "System Administrator (IT)",
                "ip_address": "10.3.101.45",
                "endpoint": "/api/v1/auth/dev-login",
                "http_method": "POST"
            },
            {
                "user_name": "System Administrator (IT)",
                "user_emp_id": "00001",
                "user_role": "admin",
                "action": "UPDATE",
                "entity_type": "vendor",
                "entity_id": vendor3.id,
                "entity_label": vendor3.name,
                "ip_address": "10.3.101.45",
                "endpoint": f"/api/v1/vendors/{vendor3.id}",
                "http_method": "PUT",
                "old_values": json.dumps({"status": "Active"}),
                "new_values": json.dumps({"status": "Blacklisted", "blacklist_reason": "Collusive bidding practices flagged by CVC"})
            },
            {
                "user_name": "System Administrator (IT)",
                "user_emp_id": "00001",
                "user_role": "admin",
                "action": "CREATE",
                "entity_type": "contract",
                "entity_id": first_contract.id,
                "entity_label": first_contract.name,
                "ip_address": "10.3.101.45",
                "endpoint": "/api/v1/contracts",
                "http_method": "POST",
                "new_values": json.dumps({"contract_no": first_contract.contract_no, "name": first_contract.name})
            },
            {
                "user_name": "Sanjay Kumar",
                "user_emp_id": "00162",
                "user_role": "purchase",
                "action": "UPDATE",
                "entity_type": "role",
                "entity_id": sanjay_user.id,
                "entity_label": "Sanjay Kumar Access Update",
                "ip_address": "10.3.102.12",
                "endpoint": f"/api/v1/admin/users/{sanjay_user.id}/role",
                "http_method": "PUT",
                "old_values": json.dumps({"role": "initiator"}),
                "new_values": json.dumps({"role": "purchase"})
            }
        ]
        for log_data in audit_logs:
            l = AuditLog(
                user_id=admin_user.id if log_data["user_emp_id"] == "00001" else sanjay_user.id,
                user_name=log_data["user_name"],
                user_emp_id=log_data["user_emp_id"],
                user_role=log_data["user_role"],
                action=log_data["action"],
                entity_type=log_data["entity_type"],
                entity_id=log_data["entity_id"],
                entity_label=log_data["entity_label"],
                ip_address=log_data["ip_address"],
                endpoint=log_data["endpoint"],
                http_method=log_data["http_method"],
                old_values=log_data.get("old_values"),
                new_values=log_data.get("new_values"),
                success=True
            )
            db.session.add(l)

        db.session.commit()
        click.echo("[OK] Sample data seeded successfully")
    else:
        click.echo("Sample data already exists, skipping...")


def register_cli(app):
    @app.cli.command("seed-db")
    @with_appcontext
    def seed_db():
        """Seed database with roles, permissions, and sample data"""
        click.echo("Initializing database...")
        db.create_all()
        seed_roles_and_permissions()
        seed_sample_data()
        click.echo("[OK] Database seeded successfully!")

    @app.cli.command("create-db")
    @with_appcontext
    def create_db():
        """Create all database tables"""
        db.create_all()
        click.echo("[OK] Database tables created!")
