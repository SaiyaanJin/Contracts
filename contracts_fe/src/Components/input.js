import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Container, Row, Col } from "react-grid-system";
import { Fieldset } from "primereact/fieldset";
import { Divider } from "primereact/divider";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import jwt_decode from "jwt-decode";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { FileUpload } from "primereact/fileupload";
import { Dialog } from "primereact/dialog";
import { CascadeSelect } from "primereact/cascadeselect";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import "../cssFiles/ButtonDemo.css";

function Input(params) {
	const toast = useRef();
	const fu = useRef();
	const search = useLocation().search;
	const id = new URLSearchParams(search).get("token");

	const navigate = useNavigate();
	const [page_hide, setpage_hide] = useState(true);
	params.var3(page_hide);

	const [User_id, setUser_id] = useState();
	const [Person_Name, setPerson_Name] = useState();
	const [User_Department, setUser_Department] = useState();

	const [Selected_department, setSelected_department] = useState();
	const [Selected_department_dropdown, setSelected_department_dropdown] =
		useState();

	const [Contract_Name, setContract_Name] = useState();

	const [Short_Description, setShort_Description] = useState();

	const [File, setFile] = useState([]);
	const [Contract_Award_Date, setContract_Award_Date] = useState();
	const [Seller_Name, setSeller_Name] = useState();
	const [selected_contract_type, setselected_contract_type] = useState();

	const [Contract_Period, setContract_Period] = useState();
	const [CP_tristate_value, setCP_tristate_value] = useState();
	const [CP_y_m_d, setCP_y_m_d] = useState(" Years");
	const [Contract_Start_Date, setContract_Start_Date] = useState(null);
	const [Contract_End_Date, setContract_End_Date] = useState();
	const [Contract_Reference_No, setContract_Reference_No] = useState();
	const [selected_contract_platform, setselected_contract_platform] =
		useState();
	const [Contract_Value, setContract_Value] = useState();
	const [E_I_C, setE_I_C] = useState();

	const [checked, setChecked] = useState(false);

	const [Intending_dept_visibility, setIntending_dept_visibility] =
		useState(false);

	const [success_insert, setsuccess_insert] = useState(false);
	const [Entry_No, setEntry_No] = useState();

	const contract_type = [
		{ name: "Supply", code: "Supply" },
		{ name: "Service", code: "Service" },
		{ name: "Supply + Service", code: "Supply + Service" },
		{ name: "Subscription", code: "Subscription" },
	];

	const contract_platform = [
		{ name: "GEM", code: "GEM" },
		{ name: "E-Procurement Portal", code: "E-Procurement Portal" },
		{ name: "Offline", code: "Offline" },
		{ name: "Others", code: "Others" },
	];

	const Department = [
		{
			cname: "System Operation",
			code: "System Operation",
		},
		{
			cname: "Market Operation",
			code: "Market Operation",
		},
		{
			name: "Logistics",
			code: "Logistics",
			states: [
				{ cname: "SCADA", code: "SCADA" },
				{ cname: "Communication", code: "Communication" },
				{ cname: "Information Technology", code: "Information Technology" },
				{ cname: "Technical Services", code: "Technical Services" },
			],
		},

		{ cname: "Finance & Accounts", code: "Finance & Accounts" },
		{ cname: "Human Resource", code: "Human Resource" },
		{ cname: "Contracts & Services", code: "Contracts & Services" },
	];

	const onChangeContractType = (e) => {
		setselected_contract_type(e.value);
	};

	useEffect(() => {
		if (id) {
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
								.post("https://sso.erldc.in:5000/logout", {
									headers: { token: id },
								})
								.then((response) => {
									window.location = "https://sso.erldc.in:3000";
								})
								.catch((error) => {});
						} else {
							setUser_id(decoded["User"]);
							setpage_hide(!decoded["Login"]);
							setPerson_Name(decoded["Person_Name"]);

							if (
								decoded["Department"] === "IT-TS" ||
								decoded["Department"] === "IT"
							) {
								setUser_Department("Information Technology");
							}
							if (
								decoded["Department"] === "MO" ||
								decoded["Department"] === "MO-I" ||
								decoded["Department"] === "MO-II" ||
								decoded["Department"] === "MO-III" ||
								decoded["Department"] === "MO-IV"
							) {
								setUser_Department("Market Operation");
							}
							if (
								decoded["Department"] === "MIS" ||
								decoded["Department"] === "SS" ||
								decoded["Department"] === "CR" ||
								decoded["Department"] === "SO"
							) {
								setUser_Department("System Operation");
							}

							if (decoded["Department"] === "SCADA") {
								setUser_Department("SCADA");
							}
							if (decoded["Department"] === "CS") {
								setUser_Department("Contracts & Services");
							}
							if (decoded["Department"] === "TS") {
								setUser_Department("Technical Services");
							}

							if (decoded["Department"] === "HR") {
								setUser_Department("Human Resource");
							}
							if (decoded["Department"] === "COMMUNICATION") {
								setUser_Department("Communication");
							}
							if (decoded["Department"] === "F&A") {
								setUser_Department("Finance & Accounts");
							}
							if (decoded["Department"] === "CR") {
								setUser_Department("Control Room");
							}
						}
					}
				})
				.catch((error) => {});

			if (Person_Name && User_id && User_Department) {
				showInfo(
					"Sh. " + Person_Name + " (" + User_id + ") of " + User_Department
				);
			}
		} else {
			setpage_hide(true);
			params.var3("Invalid_Token");
		}
	}, [Person_Name, User_id, User_Department]);

	useEffect(() => {
		if (CP_tristate_value === undefined || CP_tristate_value === null) {
			setCP_y_m_d(" Years");
		} else if (CP_tristate_value) {
			setCP_y_m_d(" Months");
		} else {
			setCP_y_m_d(" Days");
		}
	}, [
		Selected_department_dropdown,

		selected_contract_type,

		CP_y_m_d,
		CP_tristate_value,
	]);

	const submit_data = () => {
		if (
			Selected_department &&
			selected_contract_type &&
			selected_contract_platform
		) {
			var data_to_send = {
				BOQ_File_Name: File,
				Intending_Department: Selected_department["code"],
				Contract_Name: Contract_Name,
				Short_Description: Short_Description,
				Contract_Award_Date: moment(Contract_Award_Date).format("DD-MM-YYYY"),
				Seller_Name: Seller_Name,
				Contract_Type: selected_contract_type["name"],
				Contract_Period: Contract_Period + CP_y_m_d,
				Contract_Start_Date: moment(Contract_Start_Date).format("DD-MM-YYYY"),
				Contract_End_Date: moment(Contract_End_Date).format("DD-MM-YYYY"),
				Contract_Reference_No: Contract_Reference_No,
				Contract_Platform: selected_contract_platform["name"],
				Contract_Value: Contract_Value,
				E_I_C: E_I_C,
				Data_Entered_By: Person_Name + " (" + User_id + ") " + User_Department,
				Expired_Mail_Sent: "No",
				Type: "Active",
			};

			var keys = Object.keys(data_to_send);
			var alert_val = "Please Fill ";
			keys.map((e) => {
				if (
					data_to_send[e] === undefined ||
					data_to_send[e] === moment().format("DD-MM-YYYY")
				) {
					alert_val = alert_val + e + ", ";
				}
			});
			if (alert_val !== "Please Fill ") {
				alert(alert_val + "fields");
			} else {
				axios
					.get("http://10.3.200.63:5011/contracts_insert", {
						headers: { datas: JSON.stringify(data_to_send) },
					})
					.then((response) => {
						if (response.data === "Please Fill Valid Data") {
							showError(response.data);
						} else if (response.data[0] === "Data Inserted Successfully") {
							showSuccess(response.data);
							setsuccess_insert(true);
							setEntry_No(response.data[1]);
						} else {
							showWarn(response.data);
						}
					})
					.catch((error) => {});
			}
		} else {
			alert("Please fill all values");
		}
	};

	const showSuccess = (variable) => {
		toast.current.show({
			severity: "success",
			summary: "Data Uploaded",
			detail: variable,
			life: 3000,
		});
	};

	const showInfo = (v) => {
		toast.current.show({
			severity: "info",
			summary: v,
			detail: "Please fill all fields carefully",
			life: 2000,
		});
	};

	const showError = (variable) => {
		toast.current.show({
			severity: "error",
			summary: "Error",
			detail: variable,
			life: 3000,
		});
	};

	const showWarn = (variable) => {
		toast.current.show({
			severity: "warn",
			summary: "Error",
			detail: variable,
			life: 3000,
		});
	};

	const file_name1 = (e) => {
		var filenames = [];
		for (var i = 0; i < e.files.length; i++) {
			filenames = [...filenames, ...[e.files[i].name]];
		}
		let arr = [...File, ...filenames];

		setFile([...new Set(arr)]);
	};

	const inserted_footerContent = (
		<div>
			<Button
				label="OK"
				icon="pi pi-check"
				onClick={() => {
					setsuccess_insert(false);
					navigate("/Contracts?token=" + id);
				}}
				autoFocus
			/>
		</div>
	);

	return (
		<>
			<Dialog
				header="Attention"
				visible={success_insert}
				style={{ width: "50vw" }}
				onHide={() => setsuccess_insert(false)}
				footer={inserted_footerContent}
			>
				<p className="m-0">
					Contract for {Selected_department} Department is seccessfully inserted
					on {moment().format("DD-MM-YYYY hh:mm a")} by{" "}
					{Person_Name + " (" + User_id + ")"} with Entry Number {Entry_No}.
					<br></br>
					Click OK to View your Logged Contracts Data
				</p>
			</Dialog>

			<Toast ref={toast} />

			<div className="card flex justify-content-center">
				<Dialog
					header="Departments"
					visible={Intending_dept_visibility}
					style={{ width: "20vw" }}
					breakpoints={{ "960px": "75vw", "641px": "100vw" }}
				></Dialog>

				<Dialog
					header="Departments"
					visible={Intending_dept_visibility}
					style={{ width: "20vw" }}
					breakpoints={{ "960px": "75vw", "641px": "100vw" }}
				></Dialog>

				<Dialog
					header="Select Intending Department"
					visible={Intending_dept_visibility && !page_hide}
					onHide={() => setIntending_dept_visibility(false)}
					style={{ width: "20vw" }}
					breakpoints={{ "960px": "75vw", "641px": "100vw" }}
				>
					<div className="card flex justify-content-center">
						<Dropdown
							value={Selected_department_dropdown}
							onChange={(e) => {
								setSelected_department_dropdown(e.value);
								setIntending_dept_visibility(false);
								// seti_d_division_visibility(true);
							}}
							options={Department}
							optionLabel="name"
							placeholder="select Department"
							className="w-full md:w-14rem"
						/>
					</div>
				</Dialog>
			</div>

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
								className="pi pi-spin pi-cog"
								style={{ fontWeight: "bold", fontSize: "small" }}
							></span>
							<span>Contracts Input</span>
						</div>
					}
				>
					<Container>
						<Row>
							<Col sm={3}>
								<div className="card flex justify-content-left">
									<span className="p-float-label">
										<h4>1. Intending Department</h4>

										<CascadeSelect
											required={true}
											placeholder="Select Department"
											inputId="cs-city"
											value={Selected_department}
											onChange={(e) => setSelected_department(e.value)}
											options={Department}
											optionLabel="cname"
											optionGroupLabel="name"
											optionGroupChildren={["states", "cities"]}
											className="w-full md:w-18rem"
											breakpoint="767px"
										/>
									</span>
								</div>
							</Col>

							<Col sm={4}>
								<div className="card flex justify-content-center">
									<span className="p-float-label">
										<h4>2. Contract Name</h4>

										<InputTextarea
											required={true}
											placeholder="Contract Name"
											value={Contract_Name}
											onChange={(e) => setContract_Name(e.target.value)}
											rows={1}
											cols={40}
										/>
									</span>
								</div>
							</Col>

							<Col sm={4}>
								<div className="card flex justify-content-right">
									<span className="p-float-label">
										<h4>3. Short Description</h4>

										<InputTextarea
											placeholder="Short Description"
											value={Short_Description}
											onChange={(e) => setShort_Description(e.target.value)}
											rows={1}
											cols={60}
										/>
									</span>
								</div>
							</Col>
						</Row>
					</Container>

					<Divider />

					<Container>
						<Row>
							<Col sm={12}>
								<div className="card flex justify-content-center">
									<span className="p-float-label" style={{ width: "100%" }}>
										<h4>4. Upload BOQ</h4>

										<FileUpload
											ref={fu}
											chooseLabel={"Select Files"}
											cancelLabel={"Clear All"}
											previewWidth={300}
											name="demo[]"
											onUpload={file_name1}
											url={"http://10.3.200.63:5011/upload?entry="+String(Entry_No)}
											accept="pdf/*"
											maxFileSize={50000000}
											multiple
											emptyTemplate={
												<p className="m-0">Drag and drop relevant BOQ file.</p>
											}
										/>
									</span>
								</div>
							</Col>
						</Row>
					</Container>

					<Divider />

					<Container>
						<Row>
							<Col sm={3}>
								<div className="card flex justify-content-left">
									<span className="p-float-label">
										<h4>5. Contract Award Date:</h4>

										<Calendar
											placeholder="Contract Award Date"
											value={Contract_Award_Date}
											onChange={(e) => setContract_Award_Date(e.value)}
											showIcon
											dateFormat="dd-MM-yy"
										/>
									</span>
								</div>
							</Col>

							<Col sm={4.3}>
								<div className="card flex justify-content-right">
									<span className="p-float-label">
										<h4>6. Seller Name</h4>

										<InputTextarea
											placeholder="Seller Name"
											value={Seller_Name}
											onChange={(e) => setSeller_Name(e.target.value)}
											rows={1}
											cols={45}
										/>
									</span>
								</div>
							</Col>

							<Col sm={2.7}>
								<div className="card flex justify-content-right">
									<span className="p-float-label">
										<h4>7. Contract Type</h4>

										<Dropdown
											placeholder="Contract Type"
											inputId="dd-city"
											value={selected_contract_type}
											onChange={(e) => onChangeContractType(e)}
											options={contract_type}
											optionLabel="name"
											className="w-full md:w-14rem"
										/>
									</span>
								</div>
							</Col>

							<Col sm={2}>
								<div className="card flex justify-content-right">
									<span className="p-float-label">
										<h4>
											8. Contract Period {CP_y_m_d}{" "}
											<TriStateCheckbox
												value={CP_tristate_value}
												onChange={(e) => setCP_tristate_value(e.value)}
											/>
										</h4>

										<InputNumber
											placeholder="Contract Period"
											value={Contract_Period}
											onChange={(e) => {
												setContract_Period(e.value);
											}}
											suffix={CP_y_m_d}
										/>
									</span>
								</div>
							</Col>
						</Row>
					</Container>

					<Divider />

					<Container>
						<Row>
							<Col sm={3}>
								<div className="card flex justify-content-left">
									<span className="p-float-label">
										<h4>9. Contract Start Date:</h4>

										<Calendar
											placeholder="Contract Start Date"
											value={Contract_Start_Date}
											onChange={(e) => setContract_Start_Date(e.value)}
											showIcon
											dateFormat="dd-MM-yy"
										/>
									</span>
								</div>
							</Col>

							<Col sm={3}>
								<div className="card flex justify-content-left">
									<span className="p-float-label">
										<h4>10. Contract End Date:</h4>

										<Calendar
											placeholder="Contract End Date"
											value={Contract_End_Date}
											onChange={(e) => setContract_End_Date(e.value)}
											showIcon
											dateFormat="dd-MM-yy"
										/>
									</span>
								</div>
							</Col>

							<Col sm={4}>
								<div className="card flex justify-content-right">
									<span className="p-float-label">
										<h4>11. Contract Reference No:</h4>

										<InputTextarea
											placeholder="Reference Number"
											value={Contract_Reference_No}
											onChange={(e) => setContract_Reference_No(e.target.value)}
											rows={1}
											cols={40}
										/>
									</span>
								</div>
							</Col>

							<Col sm={2}>
								<div className="card flex justify-content-right">
									<span className="p-float-label">
										<h4>12. Contract Platform</h4>

										<Dropdown
											placeholder="Contract Platform"
											required
											size={"large"}
											value={selected_contract_platform}
											onChange={(e) => setselected_contract_platform(e.value)}
											options={contract_platform}
											optionLabel="name"
											className="w-full md:w-16rem"
										/>
									</span>
								</div>
							</Col>
						</Row>
					</Container>

					<Divider />

					<Container>
						<Row>
							<Col sm={3}>
								<div className="card flex justify-content-left">
									<span className="p-float-label">
										<h4>13. Contract Value:</h4>

										<InputNumber
											placeholder="Contract Value in ₹"
											value={Contract_Value}
											onChange={(e) => setContract_Value(e.value)}
											prefix="₹ "
										/>
									</span>
								</div>
							</Col>

							<Col sm={4}>
								<div className="card flex justify-content-left">
									<span className="p-float-label">
										<h4>14. E-I-C:</h4>

										<InputTextarea
											placeholder="Engineer in Charge"
											value={E_I_C}
											onChange={(e) => setE_I_C(e.target.value)}
											rows={1}
											cols={50}
										/>
									</span>
								</div>
							</Col>
						</Row>
					</Container>

					<Divider />

					<br />
					<br />

					<div className="card flex justify-content-center">
						<Checkbox
							onChange={(e) => setChecked(e.checked)}
							checked={checked}
						></Checkbox>
					</div>
					<br />
					<div className="card flex justify-content-center">
						<h4>I've Filled all Data Correctly and wish to Submit</h4>
					</div>
					<br />
					<div className="card flex justify-content-center">
						<Toast ref={toast} />
						<div className="flex flex-wrap gap-2">
							<Button
								disabled={!checked}
								label="Submit Data"
								className="p-button-success"
								onClick={() => {
									submit_data();
								}}
							/>
						</div>
					</div>
				</Fieldset>
			)}
			{/* //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
		</>
	);
}
export default Input;
