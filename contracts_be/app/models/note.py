"""
eOffice NoteSheet Models — Complete Digital Noting System
"""
import uuid
from datetime import datetime
from ..extensions import db


class NoteSheet(db.Model):
    """Digital Note Sheet (eOffice-style)"""
    __tablename__ = "note_sheets"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    contract_id = db.Column(db.String(36), db.ForeignKey("contracts.id"))
    tender_id = db.Column(db.String(36), db.ForeignKey("tenders.id"))

    # Identification
    file_no = db.Column(db.String(100), nullable=False)
    subject = db.Column(db.String(500), nullable=False)
    note_type = db.Column(db.String(100))
    # Initiation, Approval, Review, Amendment, Renewal, Award

    # Participants
    created_by_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    current_with_id = db.Column(db.String(36), db.ForeignKey("users.id"))

    # Movement status
    status = db.Column(db.String(50), default="Draft")
    # Draft, In Movement, With Approver, Approved, Rejected, Closed

    # Workflow linkage
    workflow_id = db.Column(db.String(36), db.ForeignKey("workflows.id"))

    # Priority
    priority = db.Column(db.String(20), default="Normal")  # Normal, Urgent, Most Urgent

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    closed_at = db.Column(db.DateTime)

    # Relationships
    entries = db.relationship("NoteEntry", backref="note_sheet", lazy="dynamic",
                              cascade="all, delete-orphan",
                              order_by="NoteEntry.created_at")
    created_by = db.relationship("User", foreign_keys=[created_by_id])
    current_with = db.relationship("User", foreign_keys=[current_with_id])

    def to_dict(self, include_entries=False):
        data = {
            "id": self.id,
            "contract_id": self.contract_id,
            "tender_id": self.tender_id,
            "file_no": self.file_no,
            "subject": self.subject,
            "note_type": self.note_type,
            "status": self.status,
            "priority": self.priority,
            "created_by": self.created_by.to_dict() if self.created_by else None,
            "current_with": self.current_with.to_dict() if self.current_with else None,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
        if include_entries:
            data["entries"] = [e.to_dict() for e in self.entries]
        return data


class NoteEntry(db.Model):
    """Individual note/comment in a note sheet"""
    __tablename__ = "note_entries"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    note_sheet_id = db.Column(db.String(36), db.ForeignKey("note_sheets.id"), nullable=False)

    # Author
    author_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)

    # Content
    content = db.Column(db.Text, nullable=False)
    action = db.Column(db.String(100))
    # Noted, Forwarded to, Approved, Rejected, Returned, Information, Observation, Comment

    # Movement
    forwarded_to_id = db.Column(db.String(36), db.ForeignKey("users.id"))

    # Attachments
    attachments = db.Column(db.Text)  # JSON list of document IDs

    # Signature
    is_signed = db.Column(db.Boolean, default=False)

    # Version (for edit tracking)
    version = db.Column(db.Integer, default=1)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    author = db.relationship("User", foreign_keys=[author_id])
    forwarded_to = db.relationship("User", foreign_keys=[forwarded_to_id])

    def to_dict(self):
        import json
        return {
            "id": self.id,
            "note_sheet_id": self.note_sheet_id,
            "author": self.author.to_dict() if self.author else None,
            "content": self.content,
            "action": self.action,
            "forwarded_to": self.forwarded_to.to_dict() if self.forwarded_to else None,
            "attachments": json.loads(self.attachments) if self.attachments else [],
            "is_signed": self.is_signed,
            "version": self.version,
            "created_at": self.created_at.isoformat(),
        }
