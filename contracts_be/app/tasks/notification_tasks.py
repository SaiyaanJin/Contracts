"""
Background Tasks — Celery + APScheduler
Contract expiry checks, SLA monitoring, renewal alerts
"""
from datetime import date, timedelta
from celery import shared_task


@shared_task
def send_contract_created_notification(contract_id: str):
    """Async notification when contract is created"""
    from app import create_app
    from app.models.contract import Contract
    app = create_app()
    with app.app_context():
        contract = Contract.query.get(contract_id)
        if contract:
            from app.services.notification_service import NotificationService
            NotificationService.notify_contract_expiry(contract)


@shared_task
def check_contract_expiries():
    """
    Daily task: Check all contracts and send expiry alerts.
    Replaces the per-request email logic in the old system.
    """
    from app import create_app
    from app.models.contract import Contract
    from app.services.notification_service import NotificationService
    from app.extensions import db

    app = create_app()
    with app.app_context():
        today = date.today()

        # Contracts expiring in 30 days
        expiring_30 = Contract.query.filter(
            Contract.end_date == today + timedelta(days=30),
            Contract.status.notin_(["Terminated", "Completed"])
        ).all()

        for c in expiring_30:
            NotificationService.notify_contract_expiry(c)
            if not c.renewal_alert_30_sent:
                c.renewal_alert_30_sent = True

        # Contracts expiring in 60 days
        expiring_60 = Contract.query.filter(
            Contract.end_date == today + timedelta(days=60),
            Contract.status.notin_(["Terminated", "Completed"])
        ).all()
        for c in expiring_60:
            if not c.renewal_alert_60_sent:
                NotificationService.notify_contract_expiry(c)
                c.renewal_alert_60_sent = True

        # Contracts expiring in 90 days
        expiring_90 = Contract.query.filter(
            Contract.end_date == today + timedelta(days=90),
            Contract.status.notin_(["Terminated", "Completed"])
        ).all()
        for c in expiring_90:
            if not c.renewal_alert_90_sent:
                NotificationService.notify_contract_expiry(c)
                c.renewal_alert_90_sent = True

        # Contracts expiring in 180 days
        expiring_180 = Contract.query.filter(
            Contract.end_date == today + timedelta(days=180),
            Contract.status.notin_(["Terminated", "Completed"])
        ).all()
        for c in expiring_180:
            if not c.renewal_alert_180_sent:
                NotificationService.notify_contract_expiry(c)
                c.renewal_alert_180_sent = True

        db.session.commit()
        return f"Checked expiries: 30={len(expiring_30)}, 60={len(expiring_60)}, 90={len(expiring_90)}, 180={len(expiring_180)}"


@shared_task
def escalate_sla_breaches():
    """Check open SLA breaches and escalate if past SLA time"""
    from app import create_app
    from app.models.sla import SLABreach, SLAMatrix
    from app.models.notification import Notification
    from app.extensions import db
    from datetime import datetime

    app = create_app()
    with app.app_context():
        open_breaches = SLABreach.query.filter_by(status="Open").all()
        for breach in open_breaches:
            sla = breach.sla
            if not sla:
                continue
            hours_since = (datetime.utcnow() - breach.breach_date).total_seconds() / 3600
            if hours_since > sla.escalation_hours and breach.escalation_level == 0:
                breach.escalation_level = 1
                breach.escalated_at = datetime.utcnow()
                if sla.escalation_level1_id:
                    notif = Notification(
                        user_id=sla.escalation_level1_id,
                        notification_type="sla_breach_escalation",
                        title="SLA Breach Escalation",
                        message=f"SLA breach for {sla.metric_name} has not been resolved in {int(hours_since)} hours.",
                        entity_type="sla_breach",
                        entity_id=breach.id,
                        priority="High",
                    )
                    db.session.add(notif)
        db.session.commit()


def setup_scheduler(app):
    """Setup APScheduler for periodic tasks"""
    try:
        from apscheduler.schedulers.background import BackgroundScheduler
        from apscheduler.triggers.cron import CronTrigger

        scheduler = BackgroundScheduler()

        # Daily at 8:00 AM — Check contract expiries
        scheduler.add_job(
            func=lambda: check_contract_expiries.delay(),
            trigger=CronTrigger(hour=8, minute=0),
            id="daily_expiry_check",
            replace_existing=True,
        )

        # Every 4 hours — Escalate SLA breaches
        scheduler.add_job(
            func=lambda: escalate_sla_breaches.delay(),
            trigger=CronTrigger(hour="*/4"),
            id="sla_escalation",
            replace_existing=True,
        )

        scheduler.start()
        app.logger.info("APScheduler started with jobs: daily_expiry_check, sla_escalation")
        return scheduler
    except Exception as e:
        app.logger.warning(f"APScheduler not started: {e}")
        return None
