"""
Contract Service — Business Logic Layer
"""
import re
from datetime import datetime
from sqlalchemy import func
from ..extensions import db
from ..models.contract import Contract


class ContractService:

    @staticmethod
    def generate_contract_no(department: str) -> str:
        """Generate unique sequential contract number"""
        dept_code = {
            "Information Technology": "IT",
            "Market Operation": "MO",
            "System Operation": "SO",
            "SCADA": "SCADA",
            "Communication": "COMM",
            "Technical Services": "TS",
            "Finance & Accounts": "FA",
            "Human Resource": "HR",
            "Contracts & Services": "CS",
        }.get(department, "GEN")

        year = datetime.utcnow().year
        # Get current max sequence for this dept + year
        pattern = f"CLM/{dept_code}/{year}/%"
        last = Contract.query.filter(
            Contract.contract_no.like(pattern)
        ).order_by(Contract.contract_no.desc()).first()

        if last:
            try:
                seq = int(last.contract_no.split("/")[-1]) + 1
            except Exception:
                seq = 1
        else:
            seq = 1

        return f"CLM/{dept_code}/{year}/{seq:04d}"

    @staticmethod
    def get_expiring_contracts(days: int):
        """Get contracts expiring within specified days"""
        from datetime import date, timedelta
        today = date.today()
        target = today + timedelta(days=days)
        return Contract.query.filter(
            Contract.end_date.between(today, target),
            Contract.status.notin_(["Terminated", "Completed"])
        ).all()

    @staticmethod
    def compute_analytics():
        """Compute analytics for caching"""
        total_value = db.session.query(func.sum(Contract.contract_value)).scalar() or 0
        return {
            "total_contract_value": float(total_value),
        }
