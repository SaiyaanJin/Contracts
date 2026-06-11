"""
Notifications API
"""
from flask import request, jsonify, g
from . import api_v1_bp
from ...extensions import db
from ...models.notification import Notification
from ...utils.decorators import require_auth
from datetime import datetime


@api_v1_bp.route("/notifications", methods=["GET"])
@require_auth
def list_notifications():
    page = request.args.get("page", 1, type=int)
    per_page = min(request.args.get("per_page", 20, type=int), 50)
    unread_only = request.args.get("unread_only", "false").lower() == "true"

    query = Notification.query.filter_by(user_id=g.current_user.id)
    if unread_only:
        query = query.filter_by(is_read=False)
    query = query.order_by(Notification.created_at.desc())
    paginated = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "notifications": [n.to_dict() for n in paginated.items],
        "unread_count": Notification.query.filter_by(
            user_id=g.current_user.id, is_read=False
        ).count(),
        "pagination": {"page": page, "per_page": per_page, "total": paginated.total},
    })


@api_v1_bp.route("/notifications/<string:notif_id>/read", methods=["POST"])
@require_auth
def mark_read(notif_id):
    notif = Notification.query.filter_by(id=notif_id, user_id=g.current_user.id).first_or_404()
    notif.is_read = True
    notif.read_at = datetime.utcnow()
    db.session.commit()
    return jsonify({"success": True})


@api_v1_bp.route("/notifications/mark-all-read", methods=["POST"])
@require_auth
def mark_all_read():
    Notification.query.filter_by(user_id=g.current_user.id, is_read=False).update(
        {"is_read": True, "read_at": datetime.utcnow()}
    )
    db.session.commit()
    return jsonify({"success": True})
