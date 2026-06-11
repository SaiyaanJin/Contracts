"""
Notification Service — Email via Exchange + In-App notifications
"""
import os
from datetime import datetime
from flask import current_app
from ..extensions import db
from ..models.notification import Notification


class NotificationService:

    @staticmethod
    def create_in_app(user_id: str, title: str, message: str,
                      notification_type: str = "general",
                      entity_type: str = None, entity_id: str = None,
                      priority: str = "Normal"):
        """Create in-app notification"""
        notif = Notification(
            user_id=user_id,
            notification_type=notification_type,
            channel="in_app",
            title=title,
            message=message,
            entity_type=entity_type,
            entity_id=entity_id,
            priority=priority,
        )
        db.session.add(notif)
        db.session.commit()
        return notif

    @staticmethod
    def send_email(to_recipients: list, subject: str, html_body: str,
                   cc_recipients: list = None):
        """Send email via Exchange server"""
        try:
            from exchangelib import (Credentials, Account, Configuration,
                                     DELEGATE, Message, Mailbox, HTMLBody)

            credentials = Credentials(
                current_app.config["MAIL_DOMAIN"] + "\\\\" + current_app.config["MAIL_USERNAME"].split("\\\\")[-1],
                current_app.config["MAIL_PASSWORD"]
            )
            config = Configuration(server=current_app.config["MAIL_SERVER"], credentials=credentials)
            account = Account(
                primary_smtp_address=current_app.config["MAIL_FROM"],
                config=config,
                autodiscover=False,
                access_type=DELEGATE
            )

            msg = Message(
                account=account,
                subject=subject,
                body="",
                to_recipients=[Mailbox(email_address=r) for r in to_recipients],
                cc_recipients=[Mailbox(email_address=r) for r in (cc_recipients or [])],
            )
            msg.body = HTMLBody(html_body)
            msg.send()
            return True
        except Exception as e:
            current_app.logger.error(f"Email send failed: {e}")
            return False

    @staticmethod
    def notify_contract_expiry(contract):
        """Send expiry notification for a contract"""
        days = contract.days_to_expiry()

        if days is None:
            return

        subject = f"Contract Expiry Alert: {contract.name} expires in {days} days"
        html_body = f"""
        <html><body>
        <p>Dear Team,</p>
        <p>The following contract is about to expire:</p>
        <table border="1" cellpadding="8" style="border-collapse:collapse;">
          <tr><td><b>Contract Name</b></td><td>{contract.name}</td></tr>
          <tr><td><b>Contract No</b></td><td>{contract.contract_no}</td></tr>
          <tr><td><b>Department</b></td><td>{contract.department}</td></tr>
          <tr><td><b>Vendor</b></td><td>{contract.vendor.name if contract.vendor else 'N/A'}</td></tr>
          <tr><td><b>End Date</b></td><td>{contract.end_date.strftime('%d-%m-%Y')}</td></tr>
          <tr><td><b>Days Remaining</b></td><td><b style="color:red">{days}</b></td></tr>
          <tr><td><b>Contract Value</b></td><td>₹ {contract.contract_value:,.2f}</td></tr>
          <tr><td><b>EIC</b></td><td>{contract.eic or 'N/A'}</td></tr>
        </table>
        <p>Please take necessary action for renewal or closure.</p>
        <br>
        <p><i>This is an automated notification from GRID-INDIA CLM Platform. Do not reply.</i></p>
        </body></html>
        """
        # Get department contacts (could be from DB)
        # For now, log
        current_app.logger.info(f"Expiry notification triggered for contract {contract.contract_no}, {days} days remaining")
        return html_body
