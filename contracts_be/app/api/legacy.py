"""
Legacy API Compatibility Layer
Maintains backward-compatible endpoints for the existing React frontend
during the migration period.
"""
from flask import Blueprint, request, jsonify
from pymongo import MongoClient
import json
import os

legacy_bp = Blueprint("legacy", __name__)

# Only connect if legacy MongoDB URI is configured
def get_legacy_collection():
    mongo_uri = os.getenv("MONGO_URI")
    if not mongo_uri:
        return None
    try:
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=3000)
        db = client["contracts"]
        return db["Contracts_Data"]
    except Exception:
        return None


@legacy_bp.route("/getcontractsData", methods=["GET", "POST"])
def legacy_get_contracts():
    """Legacy endpoint for existing React frontend"""
    department = request.args.get("Department", "")
    admin = request.args.get("Admin", "false")

    col = get_legacy_collection()
    if col is None:
        return jsonify([])

    try:
        if admin == "true":
            result = list(col.find(projection={"_id": 0}))
        else:
            result = list(col.find(
                filter={"Intending_Department": department},
                projection={"_id": 0}
            ))

        result = sorted(result, key=lambda x: x.get("Entry_No", 0), reverse=True)
        for item in result:
            item.pop("Data_Entered_By", None)

        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@legacy_bp.route("/contracts_insert", methods=["GET", "POST"])
def legacy_insert():
    """Legacy insert endpoint"""
    col = get_legacy_collection()
    if col is None:
        return jsonify("Please Submit Meaning Data")

    try:
        datas = json.loads(request.headers.get("datas", "{}"))
        last = col.find_one(sort=[("Entry_No", -1)])
        datas["Entry_No"] = int(last["Entry_No"]) + 1 if last else 1
        col.insert_one(datas)
        return jsonify(["Data Inserted Successfully", datas["Entry_No"]])
    except Exception:
        return jsonify("Please Submit Meaning Data")


@legacy_bp.route("/Contractsupdate", methods=["GET", "POST"])
def legacy_update():
    col = get_legacy_collection()
    if col is None:
        return jsonify("Error")
    try:
        datas = json.loads(request.headers.get("datas", "{}"))
        col.update_one(
            {"Contract_Reference_No": datas.get("Contract_Reference_No")},
            {"$set": datas}
        )
        return jsonify("Success")
    except Exception:
        return jsonify("Error")


@legacy_bp.route("/delete", methods=["GET", "POST"])
def legacy_delete():
    col = get_legacy_collection()
    if col is None:
        return jsonify("Error")
    try:
        datas = json.loads(request.headers.get("datas", "{}"))
        col.delete_one({"Contract_Reference_No": datas.get("Contract_Reference_No")})
        return jsonify("Success")
    except Exception:
        return jsonify("Error")


@legacy_bp.route("/dashboard", methods=["GET", "POST"])
def legacy_dashboard():
    col = get_legacy_collection()
    if col is None:
        return jsonify([])

    dept_list = [
        "System Operation", "Market Operation", "SCADA", "Communication",
        "Information Technology", "Technical Services", "Finance & Accounts",
        "Human Resource", "Contracts & Services"
    ]

    result = []
    for dept in dept_list:
        try:
            items = list(col.find(
                filter={"Intending_Department": dept},
                projection={"_id": 0, "Type": 1, "Intending_Department": 1}
            ))
            if items:
                active = sum(1 for i in items if i.get("Type") == "Active")
                expired = sum(1 for i in items if i.get("Type") == "Expired")
                about_to = sum(1 for i in items if i.get("Type") == "About to Expire")
                result.append({
                    "Department": dept,
                    "Total": len(items),
                    "Active": active,
                    "Expired": expired,
                    "About_To_Expire": about_to,
                })
        except Exception:
            continue

    return jsonify(sorted(result, key=lambda x: x["Total"], reverse=True))
