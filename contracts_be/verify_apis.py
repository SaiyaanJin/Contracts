import unittest
import json
from datetime import date, timedelta
from unittest.mock import patch, MagicMock
from app import create_app
from app.extensions import db
from app.models.vendor import Vendor
from app.models.contract import Contract, ContractObligation
from app.models.user import User, Role

class TestCLMAdvancedFeatures(unittest.TestCase):
    def setUp(self):
        self.app = create_app("testing")
        self.client = self.app.test_client()
        self.ctx = self.app.app_context()
        self.ctx.push()
        
        # Recreate DB tables
        db.create_all()
        
        # Seed roles and permissions
        from app.seed import seed_roles_and_permissions
        seed_roles_and_permissions()
        self.admin_role = Role.query.filter_by(name="admin").first()
        
        self.admin_user = User(
            emp_id="00001",
            username="admin",
            name="System Administrator",
            email="admin@grid-india.in",
            department="Information Technology",
            role_id=self.admin_role.id,
            is_active=True,
        )
        db.session.add(self.admin_user)
        
        # Seed vendors (Active & Blacklisted)
        self.active_vendor = Vendor(
            vendor_code="VND-00001",
            name="Active Vendor Pvt. Ltd.",
            status="Active",
            created_by_id=self.admin_user.id
        )
        self.blacklisted_vendor = Vendor(
            vendor_code="VND-00003",
            name="Blacklisted Vendor Ltd.",
            status="Blacklisted",
            blacklist_reason="CVC Compliance breach",
            created_by_id=self.admin_user.id
        )
        db.session.add(self.active_vendor)
        db.session.add(self.blacklisted_vendor)
        db.session.flush()
        
        # Seed a contract
        self.contract = Contract(
            contract_no="ERLDC/IT/AMC/2026/001",
            file_no="ERLDC/IT/2026/0001",
            name="Annual Maintenance Contract",
            department="Information Technology",
            end_date=date.today() + timedelta(days=45),
            status="Active",
            vendor_id=self.active_vendor.id,
            created_by_id=self.admin_user.id
        )
        db.session.add(self.contract)
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.ctx.pop()

    def get_token(self):
        # Fetch JWT token
        resp = self.client.post("/api/v1/auth/dev-login", json={"emp_id": "00001"})
        data = json.loads(resp.data)
        return data["access_token"]

    def test_health(self):
        resp = self.client.get("/health")
        self.assertEqual(resp.status_code, 200)
        data = json.loads(resp.data)
        self.assertEqual(data["status"], "ok")

    def test_blacklist_blocking(self):
        token = self.get_token()
        headers = {"Authorization": f"Bearer {token}"}
        
        # Try to initiate contract with blacklisted vendor
        payload = {
            "name": "New SCADA Systems Works",
            "department": "SCADA",
            "contract_type": "Supply",
            "end_date": (date.today() + timedelta(days=90)).isoformat(),
            "vendor_id": self.blacklisted_vendor.id
        }
        resp = self.client.post("/api/v1/contracts", json=payload, headers=headers)
        self.assertEqual(resp.status_code, 400)
        data = json.loads(resp.data)
        self.assertIn("blacklisted", data["error"])

    def test_obligations_crud(self):
        token = self.get_token()
        headers = {"Authorization": f"Bearer {token}"}
        
        # Create obligation
        payload = {
            "title": "Submit Performance BG",
            "due_date": (date.today() + timedelta(days=15)).isoformat(),
            "obligation_type": "Statutory"
        }
        resp = self.client.post(f"/api/v1/contracts/{self.contract.id}/obligations", json=payload, headers=headers)
        self.assertEqual(resp.status_code, 201)
        data = json.loads(resp.data)
        self.assertEqual(data["title"], "Submit Performance BG")
        ob_id = data["id"]
        
        # List obligations
        resp = self.client.get(f"/api/v1/contracts/{self.contract.id}/obligations", headers=headers)
        self.assertEqual(resp.status_code, 200)
        data = json.loads(resp.data)
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]["title"], "Submit Performance BG")
        
        # Update obligation
        resp = self.client.put(
            f"/api/v1/contracts/{self.contract.id}/obligations/{ob_id}",
            json={"status": "Approved", "remarks": "BG verified"},
            headers=headers
        )
        self.assertEqual(resp.status_code, 200)
        data = json.loads(resp.data)
        self.assertEqual(data["status"], "Approved")
        self.assertEqual(data["remarks"], "BG verified")
        
        # Delete obligation
        resp = self.client.delete(f"/api/v1/contracts/{self.contract.id}/obligations/{ob_id}", headers=headers)
        self.assertEqual(resp.status_code, 200)
        
        # Verify deletion
        resp = self.client.get(f"/api/v1/contracts/{self.contract.id}/obligations", headers=headers)
        self.assertEqual(len(json.loads(resp.data)), 0)

    @patch("app.api.v1.auth.requests.get")
    def test_sso_login_it_department(self, mock_get):
        import jwt as pyjwt
        payload = {
            "Login": True,
            "User": "09999",
            "Person_Name": "IT Engineer User",
            "Department": "IT"
        }
        final_token = pyjwt.encode(payload, "dummy_secret", algorithm="HS256")
        
        mock_resp = MagicMock()
        mock_resp.json.return_value = {"Final_Token": final_token}
        mock_get.return_value = mock_resp
        
        resp = self.client.post("/api/v1/auth/sso-login", json={"sso_token": "valid_sso_token"})
        self.assertEqual(resp.status_code, 200)
        
        user = User.query.filter_by(emp_id="09999").first()
        self.assertIsNotNone(user)
        self.assertEqual(user.department, "Information Technology")
        self.assertEqual(user.role.name, "admin")
        self.assertEqual(user.role.display_name, "System Administrator (IT)")

    @patch("app.api.v1.auth.requests.get")
    def test_sso_login_it_long_department(self, mock_get):
        import jwt as pyjwt
        payload = {
            "Login": True,
            "User": "09998",
            "Person_Name": "IT Long Name User",
            "Department": "Information Technology (IT)"
        }
        final_token = pyjwt.encode(payload, "dummy_secret", algorithm="HS256")
        
        mock_resp = MagicMock()
        mock_resp.json.return_value = {"Final_Token": final_token}
        mock_get.return_value = mock_resp
        
        resp = self.client.post("/api/v1/auth/sso-login", json={"sso_token": "valid_sso_token"})
        self.assertEqual(resp.status_code, 200)
        
        user = User.query.filter_by(emp_id="09998").first()
        self.assertIsNotNone(user)
        self.assertEqual(user.department, "Information Technology")
        self.assertEqual(user.role.name, "admin")
        self.assertEqual(user.role.display_name, "System Administrator (IT)")

    @patch("app.api.v1.auth.requests.get")
    def test_sso_login_it_ts_department(self, mock_get):
        import jwt as pyjwt
        payload = {
            "Login": True,
            "User": "08888",
            "Person_Name": "IT TS Engineer User",
            "Department": "IT-TS"
        }
        final_token = pyjwt.encode(payload, "dummy_secret", algorithm="HS256")
        
        mock_resp = MagicMock()
        mock_resp.json.return_value = {"Final_Token": final_token}
        mock_get.return_value = mock_resp
        
        resp = self.client.post("/api/v1/auth/sso-login", json={"sso_token": "valid_sso_token"})
        self.assertEqual(resp.status_code, 200)
        
        user = User.query.filter_by(emp_id="08888").first()
        self.assertIsNotNone(user)
        self.assertEqual(user.department, "Information Technology")
        self.assertEqual(user.role.name, "admin")
        self.assertEqual(user.role.display_name, "System Administrator (IT)")

    @patch("app.api.v1.auth.requests.get")
    def test_sso_login_dynamic_role_sync(self, mock_get):
        initiator_role = Role.query.filter_by(name="initiator").first()
        existing_user = User(
            emp_id="07777",
            username="07777",
            name="Transition User",
            department="Market Operation",
            role_id=initiator_role.id,
            is_active=True
        )
        db.session.add(existing_user)
        db.session.commit()
        
        import jwt as pyjwt
        payload = {
            "Login": True,
            "User": "07777",
            "Person_Name": "Transition User",
            "Department": "IT"
        }
        final_token = pyjwt.encode(payload, "dummy_secret", algorithm="HS256")
        
        mock_resp = MagicMock()
        mock_resp.json.return_value = {"Final_Token": final_token}
        mock_get.return_value = mock_resp
        
        resp = self.client.post("/api/v1/auth/sso-login", json={"sso_token": "valid_sso_token"})
        self.assertEqual(resp.status_code, 200)
        
        user = User.query.filter_by(emp_id="07777").first()
        self.assertEqual(user.department, "Information Technology")
        self.assertEqual(user.role.name, "admin")
        self.assertEqual(user.role.display_name, "System Administrator (IT)")

    @patch("app.api.v1.auth.requests.get")
    def test_sso_login_direct_token_decode(self, mock_get):
        # Mock external SSO verification to throw an exception (simulate endpoint offline)
        mock_get.side_effect = Exception("SSO Endpoint Offline")
        
        import jwt as pyjwt
        payload = {
            "Login": True,
            "User": "05555",
            "Person_Name": "Direct Login User",
            "Department": "IT",
            "Email": "direct@grid-india.in"
        }
        direct_token = pyjwt.encode(payload, "dummy_secret", algorithm="HS256")
        
        resp = self.client.post("/api/v1/auth/sso-login", json={"sso_token": direct_token})
        self.assertEqual(resp.status_code, 200)
        
        user = User.query.filter_by(emp_id="05555").first()
        self.assertIsNotNone(user)
        self.assertEqual(user.name, "Direct Login User")
        self.assertEqual(user.department, "Information Technology")
        self.assertEqual(user.email, "direct@grid-india.in")
        self.assertEqual(user.role.name, "admin")

if __name__ == "__main__":
    unittest.main()
