"""
Document Management System Models
"""
import uuid
from datetime import datetime
from ..extensions import db


class Document(db.Model):
    """Master document record"""
    __tablename__ = "documents"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))

    # Reference (polymorphic)
    ref_id = db.Column(db.String(36), nullable=False)   # ID of linked entity
    ref_type = db.Column(db.String(50), nullable=False)
    # contract, tender, vendor, invoice, award, notesheet, etc.

    # Classification
    doc_type = db.Column(db.String(100))
    # BOQ, Bid Document, LOA, PO, Invoice, SLA, MOM, Scope, Specification, etc.
    title = db.Column(db.String(500), nullable=False)
    description = db.Column(db.Text)

    # Storage
    original_filename = db.Column(db.String(500))
    stored_filename = db.Column(db.String(500))
    storage_path = db.Column(db.String(1000))
    file_size = db.Column(db.Integer)  # bytes
    mime_type = db.Column(db.String(100))
    file_extension = db.Column(db.String(20))

    # Version
    version = db.Column(db.Integer, default=1)
    is_latest = db.Column(db.Boolean, default=True)
    parent_id = db.Column(db.String(36), db.ForeignKey("documents.id"))

    # Metadata
    tags = db.Column(db.Text)       # JSON array
    checksum = db.Column(db.String(64))  # SHA256

    # Access Control
    is_confidential = db.Column(db.Boolean, default=False)
    access_roles = db.Column(db.Text)  # JSON array of role names

    # Expiry
    expiry_date = db.Column(db.Date)

    uploaded_by_id = db.Column(db.String(36), db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    versions = db.relationship(
        "DocumentVersion",
        backref="document",
        lazy="dynamic",
        foreign_keys="DocumentVersion.document_id"
    )
    uploaded_by = db.relationship("User", foreign_keys=[uploaded_by_id])

    def to_dict(self, include_versions=False):
        import json
        data = {
            "id": self.id,
            "ref_id": self.ref_id,
            "ref_type": self.ref_type,
            "doc_type": self.doc_type,
            "title": self.title,
            "description": self.description,
            "original_filename": self.original_filename,
            "file_size": self.file_size,
            "mime_type": self.mime_type,
            "file_extension": self.file_extension,
            "version": self.version,
            "is_latest": self.is_latest,
            "tags": json.loads(self.tags) if self.tags else [],
            "is_confidential": self.is_confidential,
            "expiry_date": self.expiry_date.isoformat() if self.expiry_date else None,
            "uploaded_by": self.uploaded_by.to_dict() if self.uploaded_by else None,
            "created_at": self.created_at.isoformat(),
        }
        if include_versions:
            data["version_history"] = [v.to_dict() for v in self.versions]
        return data


class DocumentVersion(db.Model):
    """Version history for documents"""
    __tablename__ = "document_versions"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    document_id = db.Column(db.String(36), db.ForeignKey("documents.id"), nullable=False)

    version_number = db.Column(db.Integer, nullable=False)
    stored_filename = db.Column(db.String(500))
    storage_path = db.Column(db.String(1000))
    file_size = db.Column(db.Integer)
    change_notes = db.Column(db.Text)
    checksum = db.Column(db.String(64))

    uploaded_by_id = db.Column(db.String(36), db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    uploaded_by = db.relationship("User", foreign_keys=[uploaded_by_id])

    def to_dict(self):
        return {
            "id": self.id,
            "document_id": self.document_id,
            "version_number": self.version_number,
            "file_size": self.file_size,
            "change_notes": self.change_notes,
            "uploaded_by": self.uploaded_by.to_dict() if self.uploaded_by else None,
            "created_at": self.created_at.isoformat(),
        }
