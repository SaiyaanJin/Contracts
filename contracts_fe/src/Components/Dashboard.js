import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Fieldset } from "primereact/fieldset";
import { Toast } from "primereact/toast";
import jwt_decode from "jwt-decode";
import { useLocation } from "react-router-dom";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { OrganizationChart } from "primereact/organizationchart";
import { Tag } from "primereact/tag";
import "../cssFiles/Animation.css";
import { CharacterMap, Viewer } from "@react-pdf-viewer/core";

function Dashboard(params) {
	const search = useLocation().search;
	const id = new URLSearchParams(search).get("token");
	const [page_hide, setpage_hide] = useState(true);
	params.var1(page_hide);
	const toast = useRef();
	const [data, setdata] = useState();
	const [User_id, setUser_id] = useState();
	const [Person_Name, setPerson_Name] = useState();
	const [Department, setDepartment] = useState();
	const [count, setcount] = useState(true);
	const [expandedRows, setExpandedRows] = useState([]);
	const [emp_data, setemp_data] = useState();
	const [isAdmin, setisAdmin] = useState(false);
	// const [AdminChecked, setAdminChecked] = useState(false);

	useEffect(() => {
		axios
			.get("https://sso.erldc.in:5000/emp_data", {
				headers: { Data: "Sanju8@92" },
			})
			.then((response) => {
				setemp_data(response.data);
			});

		if (id) {
			params.var2(id);

			axios
				.get("https://sso.erldc.in:5000/verify", {
					headers: { Token: id },
				})
				.then((response) => {
					if (response.data === "User has logout") {
						alert("User Logged-out, Please login via SSO again");
						window.location = "https://sso.erldc.in:3000";
						setpage_hide(true);
					} else if (response.data === "Bad Token") {
						alert("Unauthorised Access, Please login via SSO again");
						window.location = "https://sso.erldc.in:3000";
						setpage_hide(true);
					} else {
						var decoded = jwt_decode(response.data["Final_Token"], "it@posoco");

						if (!decoded["Login"] && decoded["Reason"] === "Session Expired") {
							alert("Session Expired, Please Login Again via SSO");

							axios
								.post("https://sso.erldc.in:5000/1ogout", {
									headers: { token: id },
								})
								.then((response) => {
									window.location = "https://sso.erldc.in:3000";
								})
								.catch((error) => {});
							window.location = "https://sso.erldc.in:3000";
						} else {
							setUser_id(decoded["User"]);
							setpage_hide(!decoded["Login"]);
							setPerson_Name(decoded["Person_Name"]);

							if (
								decoded["Department"] === "IT-TS" ||
								decoded["Department"] === "IT"
							) {
								setDepartment("Information Technology (IT)");
							}
							if (
								decoded["Department"] === "MO" ||
								decoded["Department"] === "MO-I" ||
								decoded["Department"] === "MO-II" ||
								decoded["Department"] === "MO-III" ||
								decoded["Department"] === "MO-IV"
							) {
								setDepartment("Market Operation (MO)");
							}
							if (
								decoded["Department"] === "MIS" ||
								decoded["Department"] === "SS" ||
								decoded["Department"] === "CR" ||
								decoded["Department"] === "SO"
							) {
								setDepartment("System Operation (SO)");
							}

							if (decoded["Department"] === "SCADA") {
								setDepartment("SCADA");
							}
							if (decoded["Department"] === "CS") {
								setDepartment("Contracts & Services (CS)");
							}
							if (decoded["Department"] === "TS") {
								setDepartment("Technical Services (TS)");
							}

							if (decoded["Department"] === "HR") {
								setDepartment("Human Resource (HR)");
							}
							if (decoded["Department"] === "COMMUNICATION") {
								setDepartment("Communication");
							}
							if (decoded["Department"] === "F&A") {
								setDepartment("Finance & Accounts (F&A)");
							}
							if (decoded["Department"] === "CR") {
								setDepartment("Control Room (CR)");
							}

							if (
								decoded["User"] === "00162" &&
								decoded["Person_Name"] === "Sanjay Kumar"
							) {
								setisAdmin(true);
							} else {
								setisAdmin(false);
							}
						}
					}
				})
				.catch((error) => {});
		} else {
			setpage_hide(true);
			params.var2("Invalid_Token");
		}
		if (Person_Name && User_id && count) {
			// showInfo(Person_Name + " (" + User_id + ")");
			setcount(false);

			axios
				.get("http://10.3.200.63:5011/dashboard", {
					headers: { Data: Person_Name + " (" + User_id + ")" },
				})
				.then((response) => {
					setdata(response.data);
				})
				.catch((error) => {});
		}
	}, [User_id, page_hide, Person_Name, Department]);

	const showInfo = (v) => {
		toast.current.show({
			severity: "info",
			summary: v,
			detail: "Logged In",
			life: 4000,
		});
	};

	const headerTemplate = (data) => {
		return (
			<React.Fragment>
				<span className="vertical-align-middle ml-2 font-bold line-height-3">
					{data.Department}
				</span>
			</React.Fragment>
		);
	};

	return (
		<>
			{page_hide && (
				<Fieldset>
					<div className="card flex justify-content-center">
						<h1>Please Login again by SSO</h1>
					</div>
				</Fieldset>
			)}
			{!page_hide && (
				<Fieldset
					hidden={page_hide}
					legend={
						<div className="flex align-items-center ">
							<span
								className="pi pi-home"
								style={{ fontWeight: "bold", fontSize: "small" }}
							></span>
							<span>Dashboard</span>
						</div>
					}
				>
					<div className="card flex justify-content-center">
						<marquee>
							Welcome &nbsp;
							<b>
								Sh. {Person_Name} ({User_id})
							</b>
							&nbsp; of &nbsp;<b>{Department}</b>
						</marquee>
					</div>

					{/* <div className="card ">
            <OrganizationChart value={data1} nodeTemplate={nodeTemplate} />
          </div> */}
					<div
						className="card"
						style={{
							width: "95.5vw",
							// whiteSpace: "nowrap",
						}}
					>
						<DataTable
							paginator
							rows={6}
							rowsPerPageOptions={[6, 7, 8, 9]}
							tableStyle={{ minWidth: "50rem" }}
							paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
							currentPageReportTemplate="{first} to {last} of {totalRecords}"
							scrollable
							scrollHeight="420px"
							className="mt-4"
							removableSort
							value={data}
							showGridlines
							// size="large"
						>
							<Column
								style={{
									whiteSpace: "pre-wrap",
								}}
								field="Department"
								header="Department Name"
								headerClassName="head"
								sortable
								dataType="text"
							></Column>
							<Column
								alignHeader="center"
								align={"center"}
								className="total"
								style={{
									minWidth: "10rem",
									maxWidth: "10rem",
									whiteSpace: "pre-wrap",
								}}
								field="Total"
								header="Total contracts"
								sortable
								dataType="numeric"
							></Column>
							<Column
								alignHeader="center"
								align={"center"}
								className="resolved"
								sstyle={{
									minWidth: "10rem",
									maxWidth: "10rem",
									whiteSpace: "pre-wrap",
								}}
								field="Active"
								header="Active Contracts"
								sortable
								dataType="numeric"
							></Column>
							<Column
								alignHeader="center"
								align={"center"}
								className="pending"
								style={{
									minWidth: "10rem",
									maxWidth: "10rem",
									whiteSpace: "pre-wrap",
								}}
								field="Expired"
								header="Expired Contracts"
								sortable
								dataType="numeric"
							></Column>
							<Column
								alignHeader="center"
								align={"center"}
								className="pending2"
								style={{
									minWidth: "10rem",
									maxWidth: "10rem",
									whiteSpace: "pre-wrap",
								}}
								field="About_To_Expire"
								header="About to Expire Contracts"
								sortable
								dataType="numeric"
							></Column>
						</DataTable>
					</div>
					<div className="card flex justify-content-center">
						<Toast ref={toast} />
					</div>
					<br />

					<Fieldset
						// hidden={page_hide}
						hidden={page_hide || !isAdmin}
						legend={
							<div className="flex align-items-center ">
								<span
									className="pi pi-home"
									style={{ fontWeight: "bold", fontSize: "small" }}
								></span>
								<span>Employee Details</span>
							</div>
						}
					>
						<div className="card">
							<DataTable
								value={emp_data}
								rowGroupMode="subheader"
								groupRowsBy="Department"
								sortMode="single"
								sortField="Department"
								sortOrder={1}
								expandableRowGroups
								expandedRows={expandedRows}
								onRowToggle={(e) => setExpandedRows(e.data)}
								rowGroupHeaderTemplate={headerTemplate}
								tableStyle={{ minWidth: "50rem" }}
							>
								<Column
									field="Department"
									header="Department"
									style={{ width: "20%" }}
								></Column>
								<Column
									field="Name"
									header="Employee Name"
									style={{ width: "20%" }}
								></Column>
								<Column
									field="Emp_id"
									header="Employee id"
									style={{ width: "20%" }}
								></Column>
								<Column
									field="Mail"
									header="E-Mail id"
									style={{ width: "20%" }}
								></Column>
								<Column
									field="Mobile"
									header="Contact Number"
									style={{ width: "20%" }}
								></Column>
							</DataTable>
						</div>
					</Fieldset>
				</Fieldset>
			)}
		</>
	);
}
export default Dashboard;
