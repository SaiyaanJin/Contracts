import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Container, Row, Col } from "react-grid-system";
import { Fieldset } from "primereact/fieldset";
import { Divider } from "primereact/divider";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Rating } from "primereact/rating";
import { InputNumber } from "primereact/inputnumber";
import { Slider } from "primereact/slider";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Steps } from "primereact/steps";
import jwt_decode from "jwt-decode";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";
import { Dialog } from "primereact/dialog";

import { BreadCrumb } from "primereact/breadcrumb";
import { TabView, TabPanel } from "primereact/tabview";

function Input() {
	const [v1, setv1] = useState();
	const [v2, setv2] = useState();
	const [v3, setv3] = useState();
	const [v4, setv4] = useState();
	const [v5, setv5] = useState();

	const [v6, setv6] = useState();
	const [v7, setv7] = useState();
	const [v8, setv8] = useState();
	const [v9, setv9] = useState();
	const [v10, setv10] = useState();

	const [v11, setv11] = useState();
	const [v12, setv12] = useState();
	const [v13, setv13] = useState();
	const [v14, setv14] = useState();
	const [v15, setv15] = useState();

	const [v16, setv16] = useState();
	const [v17, setv17] = useState();
	const [v18, setv18] = useState();
	const [v19, setv19] = useState();
	const [v20, setv20] = useState();

	const [v21, setv21] = useState();
	const [v22, setv22] = useState();
	const [v23, setv23] = useState();
	const [v24, setv24] = useState();
	const [v25, setv25] = useState();

	const [v26, setv26] = useState();
	const [v27, setv27] = useState();
	const [v28, setv28] = useState();
	const [v29, setv29] = useState();
	const [v30, setv30] = useState();

	const [v31, setv31] = useState();
	const [v32, setv32] = useState();
	const [v33, setv33] = useState();
	const [v34, setv34] = useState();
	const [v35, setv35] = useState();

	const [v36, setv36] = useState();
	const [v37, setv37] = useState();
	const [v38, setv38] = useState();
	const [v39, setv39] = useState();
	const [v40, setv40] = useState();

	const [v41, setv41] = useState();
	const [v42, setv42] = useState();
	const [v43, setv43] = useState();
	const [v44, setv44] = useState();
	const [v45, setv45] = useState();

	const [v46, setv46] = useState();
	const [v47, setv47] = useState();
	const [v48, setv48] = useState();
	const [v49, setv49] = useState();
	const [v50, setv50] = useState();

	const [v51, setv51] = useState();
	const [v52, setv52] = useState();

	const [items, setitems] = useState();

	const [checked, setChecked] = useState(false);
	const toast = useRef();
	const [activeIndex, setActiveIndex] = useState(0);

	const [visible1, setVisible1] = useState(true);
	const [visible2, setVisible2] = useState(false);
	const [visible3, setVisible3] = useState(false);
	const [visible4, setVisible4] = useState(false);
	const [refresh, setrefresh] = useState(true);
	const [
		Selected_Contracts_type_dropdown,
		setSelected_Contracts_type_dropdown,
	] = useState();
	const [Selected_department_dropdown, setSelected_department_dropdown] =
		useState();
	const [Selected_division_dropdown, setSelected_division_dropdown] =
		useState();

	const [division_dropdown, setdivision_dropdown] = useState();

	const [type_dropdown, settype_dropdown] = useState();

	const Department = [
		{ name: "System Operation", code: "System Operation" },
		{ name: "Market Operation", code: "Market Operation" },
		{ name: "Logistics", code: "Logistics" },
		{ name: "Cyber Security", code: "Cyber Security" },
		{ name: "Finance", code: "Finance" },
		{ name: "Human Resource", code: "Human Resource" },
		{ name: "Contract Services", code: "Contract Services" },
	];

	const SO_Division = [
		{ name: "Operational Planning", code: "Operational Planning" },
		{ name: "Real Time Operation", code: "Real Time Operation" },
		{ name: "Post Despatch", code: "Post Despatch" },
	];

	const MO_Division = [
		{
			name: "Interface Energy Metering, Accounting & Settlement",
			code: "Interface Energy Metering, Accounting & Settlement",
		},
		{
			name: "Regulatory Affairs, Market Operation planning & Coordination",
			code: "Regulatory Affairs, Market Operation planning & Coordination",
		},
		{ name: "Open Access", code: "Open Access" },
		{ name: "Market Coordination", code: "Market Coordination" },
	];

	const Logistic_Division = [
		{ name: "OT (Decision Support)", code: "System Operation" },
		{ name: "Communication", code: "Communication" },
		{ name: "IT", code: "IT" },
		{ name: "TS", code: "TS" },
	];

	const Cyber_Division = [{ name: "Cyber Security", code: "Cyber Security" }];

	const Finance_Division = [
		{ name: "Finance & Accounts", code: "Finance & Accounts" },
	];

	const HR_Division = [{ name: "Human Resource", code: "Human Resource" }];

	const CS_Division = [
		{ name: "Contract Services", code: "Contract Services" },
	];

	const Contracts_type = [
		{ name: "Upcoming Proposal", code: "Upcoming Proposal" },
		{
			name: "Proposal Initiated but not yet Awarded",
			code: "Proposal Initiated but not yet Awarded",
		},
		{
			name: "LOA placed but TOC not yet received",
			code: "LOA placed but TOC not yet received",
		},
		{
			name: "TOC received but Contract closing not yet done",
			code: "TOC received but Contract closing not yet done",
		},
	];

	const proposal_type = [
		{ name: "Supply", code: "Supply" },
		{
			name: "Works",
			code: "Works",
		},
		{
			name: "Services",
			code: "Services",
		},
		{
			name: "Installation",
			code: "Installation",
		},
	];

	const departments = [
		{ name: "SCADA", code: "SCADA" },
		{ name: "Technical Services", code: "TS" },
		{ name: "System Operation", code: "SO" },
		{ name: "Market Operation", code: "MO" },
		{ name: "Human Resource", code: "HR" },
		{ name: "Information Technology", code: "IT" },
		{ name: "Finance", code: "F&A" },
		{ name: "Contracts", code: "CNM" },
		{ name: "communication", code: "communication" },
		{ name: "Cyber Security", code: "CS" },
	];

	const iconItemTemplate = (item, options) => {
		return (
			<a className={options.className}>
				<span
					onClick={(e) => {
						if (
							[
								"System Operation",
								"Logistics",
								"Cyber Security",
								"Market Operation",
								"Human Resource",
								"Finance",
								"Contract Services",
							].indexOf(item.label) > -1
						) {
							setVisible1(true);
							setSelected_department_dropdown(null);
							setSelected_division_dropdown(null);
						}

						if (
							[
								"Operational Planning",
								"Post Despatch",
								"Real Time Operation",
								"Market Coordination",
								"Open Access",
								"Regulatory Affairs, Market Operation planning & Coordination",
								"Interface Energy Metering, Accounting & Settlement",
								"TS",
								"IT",
								"Communication",
								"OT (Decision Support)",
								"Contract Services",
								"Human Resource",
								"Finance & Accounts",
								"Cyber Security",
							].indexOf(item.label) > -1
						) {
							setVisible2(true);
							setSelected_division_dropdown(null);
						}

						if (
							[
								"TOC received but Contract closing not yet done",
								"LOA placed but TOC not yet received",
								"Proposal Initiated but not yet Awarded",
								"Upcoming Proposal",
							].indexOf(item.label) > -1
						) {
							setVisible3(true);
							setSelected_Contracts_type_dropdown(null);
						}
						if (
							[
								"Installation Type",
								"Services Type",
								"Works Type",
								"Supply Type",
							].indexOf(item.label) > -1
						) {
							setVisible4(true);
							settype_dropdown(null);
						}
					}}
					className={item.icon}
				>
					{item.label}
				</span>
			</a>
		);
	};

	useEffect(() => {
		showInfo();

		if (Selected_department_dropdown) {
			if (Selected_department_dropdown["name"] === "System Operation") {
				setdivision_dropdown(SO_Division);
			}
			if (Selected_department_dropdown["name"] === "Market Operation") {
				setdivision_dropdown(MO_Division);
			}
			if (Selected_department_dropdown["name"] === "Logistics") {
				setdivision_dropdown(Logistic_Division);
			}
			if (Selected_department_dropdown["name"] === "Cyber Security") {
				setdivision_dropdown(Cyber_Division);
			}
			if (Selected_department_dropdown["name"] === "Finance") {
				setdivision_dropdown(Finance_Division);
			}
			if (Selected_department_dropdown["name"] === "Human Resource") {
				setdivision_dropdown(HR_Division);
			}
			if (Selected_department_dropdown["name"] === "Contract Services") {
				setdivision_dropdown(CS_Division);
			}
		}

		if (
			type_dropdown &&
			Selected_department_dropdown &&
			Selected_division_dropdown &&
			Selected_Contracts_type_dropdown
		) {
			setitems([
				{
					label: Selected_department_dropdown["name"],
					template: iconItemTemplate,
				},
				{
					label: Selected_division_dropdown["name"],
					template: iconItemTemplate,
				},
				{
					label: Selected_Contracts_type_dropdown["name"],
					template: iconItemTemplate,
				},
				{ label: type_dropdown["name"] + " Type", template: iconItemTemplate },
			]);

			if (Selected_division_dropdown["name"] === "IT") {
				if (Selected_Contracts_type_dropdown["name"] === "Upcoming Proposal") {
					if (type_dropdown["name"] === "Supply") {
						setActiveIndex(0);
					}
					if (type_dropdown["name"] === "Works") {
						setActiveIndex(0);
					}
					if (type_dropdown["name"] === "Services") {
						setActiveIndex(0);
					}
					if (type_dropdown["name"] === "Installation") {
						setActiveIndex(0);
					}
				}

				if (
					Selected_Contracts_type_dropdown["name"] ===
					"Proposal Initiated but not yet Awarded"
				) {
					if (type_dropdown["name"] === "Supply") {
						setActiveIndex(1);
					}
					if (type_dropdown["name"] === "Works") {
						setActiveIndex(1);
					}
					if (type_dropdown["name"] === "Services") {
						setActiveIndex(1);
					}
					if (type_dropdown["name"] === "Installation") {
						setActiveIndex(1);
					}
				}

				if (
					Selected_Contracts_type_dropdown["name"] ===
					"LOA placed but TOC not yet received"
				) {
					if (type_dropdown["name"] === "Supply") {
						setActiveIndex(2);
					}
					if (type_dropdown["name"] === "Works") {
						setActiveIndex(2);
					}
					if (type_dropdown["name"] === "Services") {
						setActiveIndex(3);
					}
					if (type_dropdown["name"] === "Installation") {
						setActiveIndex(2);
					}
				}

				if (
					Selected_Contracts_type_dropdown["name"] ===
					"TOC received but Contract closing not yet done"
				) {
					if (type_dropdown["name"] === "Supply") {
						setActiveIndex(4);
					}
					if (type_dropdown["name"] === "Works") {
						setActiveIndex(4);
					}
					if (type_dropdown["name"] === "Services") {
						setActiveIndex(5);
					}
					if (type_dropdown["name"] === "Installation") {
						setActiveIndex(4);
					}
				}
			}

			if (Selected_division_dropdown["name"] === "TS") {
				if (Selected_Contracts_type_dropdown["name"] === "Upcoming Proposal") {
					if (type_dropdown["name"] === "Supply") {
						setActiveIndex(6);
					}
					if (type_dropdown["name"] === "Works") {
						setActiveIndex(7);
					}
					if (type_dropdown["name"] === "Services") {
						setActiveIndex(8);
					}
					if (type_dropdown["name"] === "Installation") {
						setActiveIndex(9);
					}
				}

				if (
					Selected_Contracts_type_dropdown["name"] ===
					"Proposal Initiated but not yet Awarded"
				) {
					if (type_dropdown["name"] === "Supply") {
						setActiveIndex(10);
					}
					if (type_dropdown["name"] === "Works") {
						setActiveIndex(11);
					}
					if (type_dropdown["name"] === "Services") {
						setActiveIndex(12);
					}
					if (type_dropdown["name"] === "Installation") {
						setActiveIndex(13);
					}
				}

				if (
					Selected_Contracts_type_dropdown["name"] ===
					"LOA placed but TOC not yet received"
				) {
					if (type_dropdown["name"] === "Supply") {
						setActiveIndex(14);
					}
					if (type_dropdown["name"] === "Works") {
						setActiveIndex(15);
					}
					if (type_dropdown["name"] === "Services") {
						setActiveIndex(16);
					}
					if (type_dropdown["name"] === "Installation") {
						setActiveIndex(17);
					}
				}

				if (
					Selected_Contracts_type_dropdown["name"] ===
					"TOC received but Contract closing not yet done"
				) {
					if (type_dropdown["name"] === "Supply") {
						setActiveIndex(18);
					}
					if (type_dropdown["name"] === "Works") {
						setActiveIndex(19);
					}
					if (type_dropdown["name"] === "Services") {
						setActiveIndex(20);
					}
					if (type_dropdown["name"] === "Installation") {
						setActiveIndex(21);
					}
				}
			}

			if (Selected_division_dropdown["name"] === "OT (Decision Support)") {
				if (Selected_Contracts_type_dropdown["name"] === "Upcoming Proposal") {
					if (type_dropdown["name"] === "Supply") {
						setActiveIndex(0);
					}
					if (type_dropdown["name"] === "Works") {
						setActiveIndex(0);
					}
					if (type_dropdown["name"] === "Services") {
						setActiveIndex(0);
					}
					if (type_dropdown["name"] === "Installation") {
						setActiveIndex(0);
					}
				}

				if (
					Selected_Contracts_type_dropdown["name"] ===
					"Proposal Initiated but not yet Awarded"
				) {
					if (type_dropdown["name"] === "Supply") {
						setActiveIndex(1);
					}
					if (type_dropdown["name"] === "Works") {
						setActiveIndex(1);
					}
					if (type_dropdown["name"] === "Services") {
						setActiveIndex(1);
					}
					if (type_dropdown["name"] === "Installation") {
						setActiveIndex(1);
					}
				}

				if (
					Selected_Contracts_type_dropdown["name"] ===
					"LOA placed but TOC not yet received"
				) {
					if (type_dropdown["name"] === "Supply") {
						setActiveIndex(2);
					}
					if (type_dropdown["name"] === "Works") {
						setActiveIndex(2);
					}
					if (type_dropdown["name"] === "Services") {
						setActiveIndex(3);
					}
					if (type_dropdown["name"] === "Installation") {
						setActiveIndex(2);
					}
				}

				if (
					Selected_Contracts_type_dropdown["name"] ===
					"TOC received but Contract closing not yet done"
				) {
					if (type_dropdown["name"] === "Supply") {
						setActiveIndex(4);
					}
					if (type_dropdown["name"] === "Works") {
						setActiveIndex(4);
					}
					if (type_dropdown["name"] === "Services") {
						setActiveIndex(5);
					}
					if (type_dropdown["name"] === "Installation") {
						setActiveIndex(4);
					}
				}
			}

			if (Selected_division_dropdown["name"] === "Communication") {
				if (Selected_Contracts_type_dropdown["name"] === "Upcoming Proposal") {
					if (type_dropdown["name"] === "Supply") {
						setActiveIndex(38);
					}
					if (type_dropdown["name"] === "Works") {
						setActiveIndex(39);
					}
					if (type_dropdown["name"] === "Services") {
						setActiveIndex(40);
					}
					if (type_dropdown["name"] === "Installation") {
						setActiveIndex(41);
					}
				}

				if (
					Selected_Contracts_type_dropdown["name"] ===
					"Proposal Initiated but not yet Awarded"
				) {
					if (type_dropdown["name"] === "Supply") {
						setActiveIndex(42);
					}
					if (type_dropdown["name"] === "Works") {
						setActiveIndex(43);
					}
					if (type_dropdown["name"] === "Services") {
						setActiveIndex(44);
					}
					if (type_dropdown["name"] === "Installation") {
						setActiveIndex(45);
					}
				}

				if (
					Selected_Contracts_type_dropdown["name"] ===
					"LOA placed but TOC not yet received"
				) {
					if (type_dropdown["name"] === "Supply") {
						setActiveIndex(46);
					}
					if (type_dropdown["name"] === "Works") {
						setActiveIndex(47);
					}
					if (type_dropdown["name"] === "Services") {
						setActiveIndex(48);
					}
					if (type_dropdown["name"] === "Installation") {
						setActiveIndex(49);
					}
				}

				if (
					Selected_Contracts_type_dropdown["name"] ===
					"TOC received but Contract closing not yet done"
				) {
					if (type_dropdown["name"] === "Supply") {
						setActiveIndex(50);
					}
					if (type_dropdown["name"] === "Works") {
						setActiveIndex(51);
					}
					if (type_dropdown["name"] === "Services") {
						setActiveIndex(52);
					}
					if (type_dropdown["name"] === "Installation") {
						setActiveIndex(53);
					}
				}
			}

			if (Selected_division_dropdown["name"] === "Cyber Security") {
				if (Selected_Contracts_type_dropdown["name"] === "Upcoming Proposal") {
					if (type_dropdown["name"] === "Supply") {
						setActiveIndex(54);
					}
					if (type_dropdown["name"] === "Works") {
						setActiveIndex(55);
					}
					if (type_dropdown["name"] === "Services") {
						setActiveIndex(56);
					}
					if (type_dropdown["name"] === "Installation") {
						setActiveIndex(57);
					}
				}

				if (
					Selected_Contracts_type_dropdown["name"] ===
					"Proposal Initiated but not yet Awarded"
				) {
					if (type_dropdown["name"] === "Supply") {
						setActiveIndex(58);
					}
					if (type_dropdown["name"] === "Works") {
						setActiveIndex(59);
					}
					if (type_dropdown["name"] === "Services") {
						setActiveIndex(61);
					}
					if (type_dropdown["name"] === "Installation") {
						setActiveIndex(62);
					}
				}

				if (
					Selected_Contracts_type_dropdown["name"] ===
					"LOA placed but TOC not yet received"
				) {
					if (type_dropdown["name"] === "Supply") {
						setActiveIndex(63);
					}
					if (type_dropdown["name"] === "Works") {
						setActiveIndex(64);
					}
					if (type_dropdown["name"] === "Services") {
						setActiveIndex(65);
					}
					if (type_dropdown["name"] === "Installation") {
						setActiveIndex(66);
					}
				}

				if (
					Selected_Contracts_type_dropdown["name"] ===
					"TOC received but Contract closing not yet done"
				) {
					if (type_dropdown["name"] === "Supply") {
						setActiveIndex(67);
					}
					if (type_dropdown["name"] === "Works") {
						setActiveIndex(68);
					}
					if (type_dropdown["name"] === "Services") {
						setActiveIndex(69);
					}
					if (type_dropdown["name"] === "Installation") {
						setActiveIndex(70);
					}
				}
			}
		}
	}, [
		Selected_department_dropdown,
		Selected_division_dropdown,
		Selected_Contracts_type_dropdown,
		type_dropdown,
	]);

	const home = { icon: "pi pi-home", url: "https:/sso.erldc.in:3000" };

	const submit_data = () => {
		let data_to_send = {
			_id: v21,

			"Name_of_Item/Work": v1,

			Name_of_Agency: v2,

			Present_Status_of_Contract: v3,

			Contract_Type: v4,

			LOA_No: v51,

			LOA_Link: v6,

			"Technical_Specification_(Link)": v7,

			Contract_Period: v8,

			"Expiry_Date_of_Defect_Liability/_Warranty":
				moment(v9).format("DD-MM-YYYY "),

			AMC_Start_Date: moment(v10).format("DD-MM-YYYY "),

			AMC_End_Date: moment(v11).format("DD-MM-YYYY "),

			Billing_Cycle: v12,

			"Engineer-In-charge_(E-I-C)": v13,

			"Authorised_Representative_of_E-I-C": v14,

			Esclation_Matrix: v15,

			TOC_Date: moment(v16).format("DD-MM-YYYY "),

			Scope_of_Contract: v17,

			Remarks: v18,

			Date_of_Initiation_for_Technical_Approval:
				moment(v19).format("DD-MM-YYYY "),

			Date_of_Initiation_for_Administrative_Approval:
				moment(v20).format("DD-MM-YYYY "),

			"E-Office_File_reference_number": v21,

			Name_of_Indenting_Department: v22["name"],

			"Estimate_Value_(excl_GST)": v23,

			"Estimate_Value_(incl_GST)": v24,

			"Scope_of_Work_(Link)": v25,

			Current_Status_of_Proposal: v26,

			Bid_Floating_Date: moment(v27).format("DD-MM-YYYY "),

			"Technical_Evaluation_Report_(Link)": v28,

			"Bid_Opening_Date_(Technical)": moment(v29).format("DD-MM-YYYY "),

			"Extension_Details_(Technical)": v30,

			Date_of_Technical_Approval: moment(v31).format("DD-MM-YYYY "),

			"Bid_Opening_Date_(Commercial)": moment(v32).format("DD-MM-YYYY "),

			"Commercial_Evaluation_Report_(Link)": v33,

			Date_of_Opening_of_Reverse_Auction: moment(v34).format("DD-MM-YYYY "),

			Date_of_Closing_of_Reverse_Auction: moment(v35).format("DD-MM-YYYY "),

			Technical_Committee_Members: v36,

			Details_of_Contract_Closing: v37,

			Date_of_BG_Submission: moment(v38).format("DD-MM-YYYY "),

			"Negotiation_Details_(Link)": v39,

			Start_Date_of_Defect_Liability: moment(v40).format("DD-MM-YYYY "),

			BG_Value: v41,

			SD_Value: v42,

			"Liquidate_Damage_(%)": v43,

			Post_Award_Extension_Details: v44,

			Actual_Completion_Date: moment(v45).format("DD-MM-YYYY "),

			Completion_Date_as_per_LOA: moment(v46).format("DD-MM-YYYY "),

			Difficulties: v47,

			Terms_of_Payment: v48,

			"Payment_Details_(Amount_&_Date)": v49,

			No_of_Days_Pending_with_Indenting_Department: v50,

			No_of_Days_Pending_with_CS_Department: v51,

			"No_of_Days_Pending_with_F&A_Department": v52,
		};

		axios
			.get("http://10.3.200.63:5011/IT_contracts_insert", {
				headers: { datas: JSON.stringify(data_to_send) },
			})
			.then((response) => {
				if (response.data === "Please Fill Valid Data") {
					showError(response.data);
				} else if (response.data === "Data Inserted Successfully") {
					showSuccess(response.data);
				} else {
					showWarn(response.data);
				}
			})
			.catch((error) => {});
	};

	const showSuccess = (variable) => {
		toast.current.show({
			severity: "success",
			summary: "Data Uploaded",
			detail: variable,
			life: 3000,
		});
	};

	const showInfo = () => {
		toast.current.show({
			severity: "info",
			summary: "Attention",
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

	return (
		<>
			<br />

			<div className="card flex justify-content-center">
				<Dialog
					header="Departments"
					visible={visible1}
					// onHide={() => setVisible(false)}
					style={{ width: "20vw" }}
					breakpoints={{ "960px": "75vw", "641px": "100vw" }}
				></Dialog>

				<Dialog
					header="Departments"
					visible={visible1}
					// onHide={() => setVisible(false)}
					style={{ width: "20vw" }}
					breakpoints={{ "960px": "75vw", "641px": "100vw" }}
				></Dialog>

				<Dialog
					header="Departments"
					visible={visible1}
					// onHide={() => setVisible(false)}
					style={{ width: "20vw" }}
					breakpoints={{ "960px": "75vw", "641px": "100vw" }}
				></Dialog>

				<Dialog
					header="Departments"
					visible={visible1}
					// onHide={() => setVisible(false)}
					style={{ width: "20vw" }}
					breakpoints={{ "960px": "75vw", "641px": "100vw" }}
				></Dialog>

				<Dialog
					header="Departments"
					visible={visible1}
					// onHide={() => setVisible(false)}
					style={{ width: "20vw" }}
					breakpoints={{ "960px": "75vw", "641px": "100vw" }}
				>
					<div className="card flex justify-content-center">
						<Dropdown
							value={Selected_department_dropdown}
							onChange={(e) => {
								setSelected_department_dropdown(e.value);
								setVisible1(false);
								setVisible2(true);
							}}
							options={Department}
							optionLabel="name"
							placeholder="Select Department"
							className="w-full md:w-14rem"
						/>
					</div>
				</Dialog>
			</div>
			{Selected_department_dropdown ? (
				<>
					<div className="card flex justify-content-center">
						<Dialog
							header={Selected_department_dropdown["name"] + " Division"}
							visible={visible2}
							// onHide={() => setVisible(false)}
							style={{ width: "20vw" }}
							breakpoints={{ "960px": "75vw", "641px": "100vw" }}
						></Dialog>

						<Dialog
							header={Selected_department_dropdown["name"] + " Division"}
							visible={visible2}
							// onHide={() => setVisible(false)}
							style={{ width: "20vw" }}
							breakpoints={{ "960px": "75vw", "641px": "100vw" }}
						></Dialog>

						<Dialog
							header={Selected_department_dropdown["name"] + " Division"}
							visible={visible2}
							// onHide={() => setVisible(false)}
							style={{ width: "20vw" }}
							breakpoints={{ "960px": "75vw", "641px": "100vw" }}
						></Dialog>

						<Dialog
							header={Selected_department_dropdown["name"] + " Division"}
							visible={visible2}
							// onHide={() => setVisible(false)}
							style={{ width: "30vw" }}
							breakpoints={{ "960px": "75vw", "641px": "100vw" }}
						>
							<div className="card flex justify-content-center">
								<Dropdown
									value={Selected_division_dropdown}
									onChange={(e) => {
										setSelected_division_dropdown(e.value);
										setVisible2(false);
										setVisible3(true && refresh);
									}}
									options={division_dropdown}
									optionLabel="name"
									placeholder="Select Division"
									className="w-full md:w-14rem"
								/>
							</div>
						</Dialog>
					</div>
				</>
			) : (
				<></>
			)}

			{Selected_department_dropdown && Selected_division_dropdown ? (
				<>
					<div className="card flex justify-content-center">
						<Dialog
							header="Contract Type"
							visible={visible3}
							// onHide={() => setVisible(false)}
							style={{ width: "20vw" }}
							breakpoints={{ "960px": "75vw", "641px": "100vw" }}
						></Dialog>

						<Dialog
							header="Contract Type"
							visible={visible3}
							// onHide={() => setVisible(false)}
							style={{ width: "20vw" }}
							breakpoints={{ "960px": "75vw", "641px": "100vw" }}
						></Dialog>

						<Dialog
							header={"Contract Type"}
							visible={visible3}
							// onHide={() => setVisible(false)}
							style={{ width: "30vw" }}
							breakpoints={{ "960px": "75vw", "641px": "100vw" }}
						>
							<div className="card flex justify-content-center">
								<Dropdown
									value={Selected_Contracts_type_dropdown}
									onChange={(e) => {
										setSelected_Contracts_type_dropdown(e.value);
										setVisible3(false);
										setVisible4(true && refresh);
									}}
									options={Contracts_type}
									optionLabel="name"
									placeholder="Type of Contract"
									className="w-full md:w-14rem"
								/>
							</div>
						</Dialog>
					</div>
				</>
			) : (
				<></>
			)}

			{Selected_department_dropdown &&
			Selected_division_dropdown &&
			Selected_Contracts_type_dropdown ? (
				<>
					<div className="card flex justify-content-center">
						<Dialog
							header="Type"
							visible={visible4}
							// onHide={() => setVisible(false)}
							style={{ width: "20vw" }}
							breakpoints={{ "960px": "75vw", "641px": "100vw" }}
						></Dialog>

						<Dialog
							header={"Type"}
							visible={visible4}
							// onHide={() => setVisible(false)}
							style={{ width: "30vw" }}
							breakpoints={{ "960px": "75vw", "641px": "100vw" }}
						>
							<div className="card flex justify-content-center">
								<Dropdown
									value={type_dropdown}
									onChange={(e) => {
										settype_dropdown(e.value);
										setVisible4(false);
										setrefresh(false);
									}}
									options={proposal_type}
									optionLabel="name"
									placeholder="Select Type"
									className="w-full md:w-14rem"
								/>
							</div>
						</Dialog>
					</div>
				</>
			) : (
				<></>
			)}

			<br />
			<Fieldset
				legend={
					<div className="flex align-items-center text-primary">
						<span className="font-bold text-lg">Contracts Details Input</span>
					</div>
				}
			>
				{type_dropdown &&
				Selected_department_dropdown &&
				Selected_division_dropdown &&
				Selected_Contracts_type_dropdown ? (
					<>
						<div className="card flex justify-content-center">
							<div className="b">
								<BreadCrumb model={items} home={home} />
							</div>
						</div>

						<br />
						<br />
					</>
				) : (
					<></>
				)}

				<div className="card">
					{/* <div className="flex flex-wrap gap-2 mb-3">
            <Button
              onClick={() => setActiveIndex(0)}
              className="p-button-text"
              label="Activate 1st"
            />
            <Button
              onClick={() => setActiveIndex(1)}
              className="p-button-text"
              label="Activate 2nd"
            />
            <Button
              onClick={() => setActiveIndex(2)}
              className="p-button-text"
              label="Activate 3rd"
            />
          </div> */}
					<TabView
						activeIndex={activeIndex}
						onTabChange={(e) => setActiveIndex(e.index)}
						// scrollable
						// renderActiveOnly
						style={{ display: "none" }}
					>
						{/* /////////////////////////////////////tab-1///////////////////////////////////////////////////////////            */}

						<TabPanel>
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>1. Name of Item/ Work*</h4>

												<InputTextarea
													placeholder="Name of Item/ Work"
													value={v1}
													onChange={(e) => setv1(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div className="card flex justify-content-center">
											<span className="p-float-label">
												<h4>2. Contract Type*</h4>

												<InputTextarea
													placeholder="Contract Type"
													value={v4}
													onChange={(e) => setv4(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>3. Technical Specification (Link)*</h4>

												<InputTextarea
													placeholder="Technical Specification (Link)"
													value={v7}
													onChange={(e) => setv7(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />

							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>4. Contract Period*</h4>

												<InputNumber
													size={48}
													placeholder="Contract Period"
													inputId="integeronly"
													value={v8}
													onValueChange={(e) => setv8(e.value)}
													suffix=" Years"
													min={0}
													max={10}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div className="card flex justify-content-center">
											<span className="p-float-label">
												<h4>5. Scope of Contract*</h4>

												<InputTextarea
													placeholder="Preventive Maintenance Name"
													
													}
													onChange={(e) => setv17(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>6. Remarks*</h4>

												<InputTextarea
													placeholder="Remarks"
													
													value={v18}
													onChange={(e) => setv18(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />

							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>7. Name of Indenting Department*</h4>

												<Dropdown
													required
													value={v22}
													onChange={(e) => {
														setv22(e.value);
													}}
													options={departments}
													optionLabel="name"
													placeholder="Select Department"
													className="w-full md:w-14rem"
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div className="card flex justify-content-center">
											<span className="p-float-label">
												<h4>8. Current Status of Proposal*</h4>

												<InputTextarea
													placeholder="Status of Proposal"
													
													value={v26}
													onChange={(e) => setv26(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}></Col>
								</Row>
							</Container>
						</TabPanel>
						{/* /////////////////////////////////////tab-2///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>1. Name of Item/ Work*</h4>

												<InputTextarea
													placeholder="Name of Item/ Work"
													
													value={v1}
													onChange={(e) => setv1(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div className="card flex justify-content-center">
											<span className="p-float-label">
												<h4>2. Present Status of Contract*</h4>

												<InputTextarea
													placeholder="Present Status of Contract"
													
													value={v3}
													onChange={(e) => setv3(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>3. Contract Type*</h4>

												<InputTextarea
													placeholder="Contract Type"
													
													value={v4}
													onChange={(e) => setv4(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>
							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>4. Technical Specification (Link)*</h4>

												<InputTextarea
													placeholder="Technical Specification (Link)"
													
													value={v7}
													onChange={(e) => setv7(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div className="card flex justify-content-center">
											<span className="p-float-label">
												<h4>5. Contract Period*</h4>

												<InputNumber
													size={48}
													placeholder="Contract Period"
													inputId="integeronly"
													value={v8}
													onValueChange={(e) => setv8(e.value)}
													suffix=" Years"
													min={0}
													max={10}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>6. Engineer-In-charge (E-I-C)*</h4>

												<InputTextarea
													placeholder="(E-I-C)"
													
													value={v13}
													onChange={(e) => setv13(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>
							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>7. Authorised Representative of E-I-C*</h4>

												<InputTextarea
													placeholder="Representative of E-I-C"
													
													value={v14}
													onChange={(e) => setv14(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div className="card flex justify-content-center">
											<span className="p-float-label">
												<h4>8. Scope of Contract*</h4>

												<InputTextarea
													placeholder="Preventive Maintenance Name"
													
													value={v17}
													onChange={(e) => setv17(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>9. Remarks*</h4>

												<InputTextarea
													placeholder="Remarks"
													
													value={v18}
													onChange={(e) => setv18(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>
							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>10. Date of Initiation for Technical Approval*</h4>

												<Calendar
													placeholder="Technical Approval Date"
													required
													value={v19}
													onChange={(e) => setv19(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-center"
											style={{ marginLeft: "-6%" }}
										>
											<span className="p-float-label">
												<h4>
													11. Date of Initiation for Administrative Approval*
												</h4>

												<Calendar
													placeholder="Administrative Approval Date"
													required
													value={v20}
													onChange={(e) => setv20(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>12. E-Office File reference number*</h4>

												<InputNumber
													size={50}
													placeholder="E-Office File reference number"
													inputId="integeronly"
													value={v21}
													onValueChange={(e) => setv21(e.value)}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>
							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>13. Name of Indenting Department*</h4>

												<Dropdown
													required
													value={v22}
													onChange={(e) => {
														setv22(e.value);
													}}
													options={departments}
													optionLabel="name"
													placeholder="Select Department"
													className="w-full md:w-14rem"
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-center"
											style={{ marginLeft: "5%" }}
										>
											<span className="p-float-label">
												<h4>14. Estimate Value (excl GST)*</h4>

												<InputNumber
													size={50}
													placeholder="Estimate Value"
													inputId="integeronly"
													value={v23}
													onValueChange={(e) => setv23(e.value)}
													prefix="₹ "
													min={0}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>15. Estimate Value (incl GST)*</h4>

												<InputNumber
													size={50}
													placeholder="Estimate Value"
													inputId="integeronly"
													value={v24}
													onValueChange={(e) => setv24(e.value)}
													prefix="₹ "
													min={0}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>16. Scope of Work (Link)*</h4>

												<InputTextarea
													placeholder="Scope of Work"
													
													value={v25}
													onChange={(e) => setv25(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div className="card flex justify-content-center">
											<span className="p-float-label">
												<h4>17. Current Status of Proposal*</h4>

												<InputTextarea
													placeholder="Status of Proposal"
													
													value={v26}
													onChange={(e) => setv26(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>18. Bid Floating Date*</h4>

												<Calendar
													placeholder="Bid Floating Date"
													required
													value={v27}
													onChange={(e) => setv27(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>19. Technical Evaluation Report (Link)*</h4>

												<InputTextarea
													placeholder="Technical Evaluation Report"
													
													value={v28}
													onChange={(e) => setv28(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-center"
											style={{ marginLeft: "-32%" }}
										>
											<span className="p-float-label">
												<h4>20. Bid Opening Date (Technical)*</h4>

												<Calendar
													placeholder="Technical Bid Opening Date"
													required
													value={v29}
													onChange={(e) => setv29(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>21. Date of Technical Approval*</h4>

												<Calendar
													placeholder="Technical Approval Date"
													required
													value={v31}
													onChange={(e) => setv31(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>
							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>22. Technical Committee Members*</h4>

												<InputTextarea
													placeholder="Technical Committee Members"
													
													value={v36}
													onChange={(e) => setv36(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div className="card flex justify-content-center">
											<span className="p-float-label">
												<h4>23. Difficulties*</h4>

												<InputTextarea
													placeholder="Difficulties"
													
													value={v47}
													onChange={(e) => setv47(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>24. Terms of Payment*</h4>

												<InputTextarea
													placeholder="Terms of Payment"
													
													value={v48}
													onChange={(e) => setv48(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>
						</TabPanel>
						{/* /////////////////////////////////////tab-3///////////////////////////////////////////////////////////            */}

						<TabPanel>
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>1. Name of Item/ Work*</h4>

												<InputTextarea
													placeholder="Name of Item/ Work"
													
													value={v1}
													onChange={(e) => setv1(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div className="card flex justify-content-center">
											<span className="p-float-label">
												<h4>2. Name of Agency*</h4>

												<InputTextarea
													placeholder="Name of Agency"
													
													value={v2}
													onChange={(e) => setv2(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>3. Present Status of Contract*</h4>

												<InputTextarea
													placeholder="Present Status of Contract"
													
													value={v3}
													onChange={(e) => setv3(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />

							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>4. Contract Type*</h4>

												<InputTextarea
													placeholder="Contract Type"
													
													value={v4}
													onChange={(e) => setv4(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div className="card flex justify-content-center">
											<span className="p-float-label">
												<h4>5. LOA No.*</h4>

												<InputNumber
													size={48}
													placeholder="LOA No."
													inputId="integeronly"
													value={v5}
													onValueChange={(e) => setv5(e.value)}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>6. LOA Link*</h4>

												<InputTextarea
													placeholder="LOA Link"
													
													value={v6}
													onChange={(e) => setv6(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />

							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>7. Technical Specification (Link)*</h4>

												<InputTextarea
													placeholder="Technical Specification (Link)"
													
													value={v7}
													onChange={(e) => setv7(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div className="card flex justify-content-center">
											<span className="p-float-label">
												<h4>8. Contract Period*</h4>

												<InputNumber
													size={48}
													placeholder="Contract Period"
													inputId="integeronly"
													value={v8}
													onValueChange={(e) => setv8(e.value)}
													suffix=" Years"
													min={0}
													max={10}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>9. Billing Cycle*</h4>

												<InputTextarea
													placeholder="Billing Cycle"
													
													value={v12}
													onChange={(e) => setv12(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />

							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>10. Engineer-In-charge (E-I-C)*</h4>

												<InputTextarea
													placeholder="(E-I-C)"
													
													value={v13}
													onChange={(e) => setv13(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-center"
											style={{ marginLeft: "0%" }}
										>
											<span className="p-float-label">
												<h4>11. Authorised Representative of E-I-C*</h4>

												<InputTextarea
													placeholder="Representative of E-I-C"
													
													value={v14}
													onChange={(e) => setv14(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>12. Esclation Matrix*</h4>

												<InputTextarea
													placeholder="Esclation Matrix"
													
													value={v15}
													onChange={(e) => setv15(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>13. TOC Date*</h4>

												<Calendar
													placeholder="TOC Date"
													required
													value={v16}
													onChange={(e) => setv16(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div className="card flex justify-content-center">
											<span className="p-float-label">
												<h4>14. Scope of Contract*</h4>

												<InputTextarea
													placeholder="Preventive Maintenance Name"
													
													value={v17}
													onChange={(e) => setv17(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>15. Remarks*</h4>

												<InputTextarea
													placeholder="Remarks"
													
													value={v18}
													onChange={(e) => setv18(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>16. Date of Initiation for Technical Approval*</h4>

												<Calendar
													placeholder="Technical Approval Date"
													required
													value={v19}
													onChange={(e) => setv19(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-center"
											style={{ marginLeft: "-5%" }}
										>
											<span className="p-float-label">
												<h4>
													17. Date of Initiation for Administrative Approval*
												</h4>

												<Calendar
													placeholder="Administrative Approval Date"
													required
													value={v20}
													onChange={(e) => setv20(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>18. E-Office File reference number*</h4>

												<InputNumber
													size={50}
													placeholder="E-Office File reference number"
													inputId="integeronly"
													value={v21}
													onValueChange={(e) => setv21(e.value)}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>
							<Divider />

							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>19. Name of Indenting Department*</h4>

												<Dropdown
													required
													value={v22}
													onChange={(e) => {
														setv22(e.value);
													}}
													options={departments}
													optionLabel="name"
													placeholder="Select Department"
													className="w-full md:w-14rem"
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-center"
											style={{ marginLeft: "5%" }}
										>
											<span className="p-float-label">
												<h4>20. Scope of Work (Link)*</h4>

												<InputTextarea
													placeholder="Scope of Work"
													
													value={v25}
													onChange={(e) => setv25(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>21. Current Status of Proposal*</h4>

												<InputTextarea
													placeholder="Status of Proposal"
													
													value={v26}
													onChange={(e) => setv26(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>22. Bid Floating Date*</h4>

												<Calendar
													placeholder="Bid Floating Date"
													required
													value={v27}
													onChange={(e) => setv27(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div className="card flex justify-content-center">
											<span className="p-float-label">
												<h4>23. Technical Evaluation Report (Link)*</h4>

												<InputTextarea
													placeholder="Technical Evaluation Report"
													
													value={v28}
													onChange={(e) => setv28(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>24. Bid Opening Date (Technical)*</h4>

												<Calendar
													placeholder="Technical Bid Opening Date"
													required
													value={v29}
													onChange={(e) => setv29(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>25. Extension Details (Technical)*</h4>

												<InputTextarea
													placeholder="Extension Details"
													
													value={v30}
													onChange={(e) => setv30(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-center"
											style={{ marginLeft: "-28%" }}
										>
											<span className="p-float-label">
												<h4>26. Date of Technical Approval*</h4>

												<Calendar
													placeholder="Technical Approval Date"
													required
													value={v31}
													onChange={(e) => setv31(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>27. Bid Opening Date (Commercial)*</h4>

												<Calendar
													placeholder="Bid Opening Date"
													required
													value={v32}
													onChange={(e) => setv32(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>28. Commercial Evaluation Report (Link)*</h4>

												<InputTextarea
													placeholder="Commercial Evaluation Report"
													
													value={v33}
													onChange={(e) => setv33(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div className="card flex justify-content-center">
											<span className="p-float-label">
												<h4>29. Technical Committee Members*</h4>

												<InputTextarea
													placeholder="Technical Committee Members"
													
													value={v36}
													onChange={(e) => setv36(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>30. Terms of Payment*</h4>

												<InputTextarea
													placeholder="Terms of Payment"
													
													value={v48}
													onChange={(e) => setv48(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>31. Payment Details (Amount & Date)*</h4>

												<InputTextarea
													placeholder="Payment Details (Amount & Date)"
													
													value={v49}
													onChange={(e) => setv49(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-center"
											style={{ marginLeft: "5%" }}
										>
											<span className="p-float-label">
												<h4>
													32. No of Days Pending with Indenting Department*
												</h4>

												<InputNumber
													size={50}
													placeholder="Days Pending with Indenting"
													inputId="integeronly"
													value={v50}
													onValueChange={(e) => setv50(e.value)}
													suffix=" Days"
													min={0}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>33. No of Days Pending with CS Department*</h4>

												<InputNumber
													size={50}
													placeholder="Days Pending with CS"
													inputId="integeronly"
													value={v51}
													onValueChange={(e) => setv51(e.value)}
													suffix=" Days"
													min={0}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>34. No of Days Pending with F&A Department*</h4>

												<InputNumber
													size={50}
													placeholder="Days Pending with F&A"
													inputId="integeronly"
													value={v52}
													onValueChange={(e) => setv52(e.value)}
													suffix=" Days"
													min={0}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>
						</TabPanel>
						{/* /////////////////////////////////////tab-4///////////////////////////////////////////////////////////            */}

						<TabPanel>
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>1. Name of Item/ Work*</h4>

												<InputTextarea
													placeholder="Name of Item/ Work"
													
													value={v1}
													onChange={(e) => setv1(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div className="card flex justify-content-center">
											<span className="p-float-label">
												<h4>2. Name of Agency*</h4>

												<InputTextarea
													placeholder="Name of Agency"
													
													value={v2}
													onChange={(e) => setv2(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>3. Present Status of Contract*</h4>

												<InputTextarea
													placeholder="Present Status of Contract"
													
													value={v3}
													onChange={(e) => setv3(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />

							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>4. Contract Type*</h4>

												<InputTextarea
													placeholder="Contract Type"
													
													value={v4}
													onChange={(e) => setv4(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div className="card flex justify-content-center">
											<span className="p-float-label">
												<h4>5. LOA No.*</h4>

												<InputNumber
													size={48}
													placeholder="LOA No."
													inputId="integeronly"
													value={v5}
													onValueChange={(e) => setv5(e.value)}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>6. LOA Link*</h4>

												<InputTextarea
													placeholder="LOA Link"
													
													value={v6}
													onChange={(e) => setv6(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />

							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>7. Technical Specification (Link)*</h4>

												<InputTextarea
													placeholder="Technical Specification (Link)"
													
													value={v7}
													onChange={(e) => setv7(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div className="card flex justify-content-center">
											<span className="p-float-label">
												<h4>8. Contract Period*</h4>

												<InputNumber
													size={48}
													placeholder="Contract Period"
													inputId="integeronly"
													value={v8}
													onValueChange={(e) => setv8(e.value)}
													suffix=" Years"
													min={0}
													max={10}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>9. Expiry Date of Defect Liability/ Warranty*</h4>

												<Calendar
													placeholder="Expiry Date of Defect Liability/ Warranty"
													required
													value={v9}
													onChange={(e) => setv9(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />

							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>10. AMC Start Date*</h4>

												<Calendar
													placeholder="AMC Start Date"
													required
													value={v10}
													onChange={(e) => setv10(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-center"
											style={{ marginLeft: "-32%" }}
										>
											<span className="p-float-label">
												<h4>11. AMC End Date*</h4>

												<Calendar
													placeholder="AMC End Date"
													required
													value={v11}
													onChange={(e) => setv11(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>12. Billing Cycle*</h4>

												<InputTextarea
													placeholder="Billing Cycle"
													
													value={v12}
													onChange={(e) => setv12(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />

							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>13. Engineer-In-charge (E-I-C)*</h4>

												<InputTextarea
													placeholder="(E-I-C)"
													
													value={v13}
													onChange={(e) => setv13(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-center"
											style={{ marginLeft: "0%" }}
										>
											<span className="p-float-label">
												<h4>14. Authorised Representative of E-I-C*</h4>

												<InputTextarea
													placeholder="Representative of E-I-C"
													
													value={v14}
													onChange={(e) => setv14(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>15. Esclation Matrix*</h4>

												<InputTextarea
													placeholder="Esclation Matrix"
													
													value={v15}
													onChange={(e) => setv15(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>16. Scope of Contract*</h4>

												<InputTextarea
													placeholder="Preventive Maintenance Name"
													
													value={v17}
													onChange={(e) => setv17(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div className="card flex justify-content-center">
											<span className="p-float-label">
												<h4>17. Remarks*</h4>

												<InputTextarea
													placeholder="Remarks"
													
													value={v18}
													onChange={(e) => setv18(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>18. Date of Initiation for Technical Approval*</h4>

												<Calendar
													placeholder="Technical Approval Date"
													required
													value={v19}
													onChange={(e) => setv19(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>
													19. Date of Initiation for Administrative Approval*
												</h4>

												<Calendar
													placeholder="Administrative Approval Date"
													required
													value={v20}
													onChange={(e) => setv20(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-center"
											style={{ marginLeft: "-5%" }}
										>
											<span className="p-float-label">
												<h4>20. E-Office File reference number*</h4>

												<InputNumber
													size={50}
													placeholder="E-Office File reference number"
													inputId="integeronly"
													value={v21}
													onValueChange={(e) => setv21(e.value)}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>21. Name of Indenting Department*</h4>

												<Dropdown
													required
													value={v22}
													onChange={(e) => {
														setv22(e.value);
													}}
													options={departments}
													optionLabel="name"
													placeholder="Select Department"
													className="w-full md:w-14rem"
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>22. Scope of Work (Link)*</h4>

												<InputTextarea
													placeholder="Scope of Work"
													
													value={v25}
													onChange={(e) => setv25(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div className="card flex justify-content-center">
											<span className="p-float-label">
												<h4>23. Current Status of Proposal*</h4>

												<InputTextarea
													placeholder="Status of Proposal"
													
													value={v26}
													onChange={(e) => setv26(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>24. Bid Floating Date*</h4>

												<Calendar
													placeholder="Bid Floating Date"
													required
													value={v27}
													onChange={(e) => setv27(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>25. Technical Evaluation Report (Link)*</h4>

												<InputTextarea
													placeholder="Technical Evaluation Report"
													
													value={v28}
													onChange={(e) => setv28(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-center"
											style={{ marginLeft: "-32%" }}
										>
											<span className="p-float-label">
												<h4>26. Bid Opening Date (Technical)*</h4>

												<Calendar
													placeholder="Technical Bid Opening Date"
													required
													value={v29}
													onChange={(e) => setv29(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>27. Date of Technical Approval*</h4>

												<Calendar
													placeholder="Technical Approval Date"
													required
													value={v31}
													onChange={(e) => setv31(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>28. Bid Opening Date (Commercial)*</h4>

												<Calendar
													placeholder="Bid Opening Date"
													required
													value={v32}
													onChange={(e) => setv32(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-center"
											style={{ marginLeft: "-28%" }}
										>
											<span className="p-float-label">
												<h4>29. Commercial Evaluation Report (Link)*</h4>

												<InputTextarea
													placeholder="Commercial Evaluation Report"
													
													value={v33}
													onChange={(e) => setv33(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>30. Terms of Payment*</h4>

												<InputTextarea
													placeholder="Terms of Payment"
													
													value={v48}
													onChange={(e) => setv48(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>31. Payment Details (Amount & Date)*</h4>

												<InputTextarea
													placeholder="Payment Details (Amount & Date)"
													
													value={v49}
													onChange={(e) => setv49(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-center"
											style={{ marginLeft: "5%" }}
										>
											<span className="p-float-label">
												<h4>
													32. No of Days Pending with Indenting Department*
												</h4>

												<InputNumber
													size={50}
													placeholder="Days Pending with Indenting"
													inputId="integeronly"
													value={v50}
													onValueChange={(e) => setv50(e.value)}
													suffix=" Days"
													min={0}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>33. No of Days Pending with CS Department*</h4>

												<InputNumber
													size={50}
													placeholder="Days Pending with CS"
													inputId="integeronly"
													value={v51}
													onValueChange={(e) => setv51(e.value)}
													suffix=" Days"
													min={0}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>34. No of Days Pending with F&A Department*</h4>

												<InputNumber
													size={50}
													placeholder="Days Pending with F&A"
													inputId="integeronly"
													value={v52}
													onValueChange={(e) => setv52(e.value)}
													suffix=" Days"
													min={0}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>
						</TabPanel>
						{/* /////////////////////////////////////tab-5///////////////////////////////////////////////////////////            */}

						<TabPanel>
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>1. Name of Item/ Work*</h4>

												<InputTextarea
													placeholder="Name of Item/ Work"
													
													value={v1}
													onChange={(e) => setv1(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div className="card flex justify-content-center">
											<span className="p-float-label">
												<h4>2. Name of Agency*</h4>

												<InputTextarea
													placeholder="Name of Agency"
													
													value={v2}
													onChange={(e) => setv2(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>3. Present Status of Contract*</h4>

												<InputTextarea
													placeholder="Present Status of Contract"
													
													value={v3}
													onChange={(e) => setv3(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />

							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>4. Contract Type*</h4>

												<InputTextarea
													placeholder="Contract Type"
													
													value={v4}
													onChange={(e) => setv4(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div className="card flex justify-content-center">
											<span className="p-float-label">
												<h4>5. LOA No.*</h4>

												<InputNumber
													size={48}
													placeholder="LOA No."
													inputId="integeronly"
													value={v5}
													onValueChange={(e) => setv5(e.value)}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>6. LOA Link*</h4>

												<InputTextarea
													placeholder="LOA Link"
													
													value={v6}
													onChange={(e) => setv6(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />

							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>7. Technical Specification (Link)*</h4>

												<InputTextarea
													placeholder="Technical Specification (Link)"
													
													value={v7}
													onChange={(e) => setv7(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div className="card flex justify-content-center">
											<span className="p-float-label">
												<h4>8. Contract Period*</h4>

												<InputNumber
													size={48}
													placeholder="Contract Period"
													inputId="integeronly"
													value={v8}
													onValueChange={(e) => setv8(e.value)}
													suffix=" Years"
													min={0}
													max={10}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>9. Expiry Date of Defect Liability/ Warranty*</h4>

												<Calendar
													placeholder="Expiry Date of Defect Liability/ Warranty"
													required
													value={v9}
													onChange={(e) => setv9(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />

							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>10. Billing Cycle*</h4>

												<InputTextarea
													placeholder="Billing Cycle"
													
													value={v12}
													onChange={(e) => setv12(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-center"
											style={{ marginLeft: "0%" }}
										>
											<span className="p-float-label">
												<h4>11. Engineer-In-charge (E-I-C)*</h4>

												<InputTextarea
													placeholder="(E-I-C)"
													
													value={v13}
													onChange={(e) => setv13(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>12. Authorised Representative of E-I-C*</h4>

												<InputTextarea
													placeholder="Representative of E-I-C"
													
													value={v14}
													onChange={(e) => setv14(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>13. Esclation Matrix*</h4>

												<InputTextarea
													placeholder="Esclation Matrix"
													
													value={v15}
													onChange={(e) => setv15(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-center"
											style={{ marginLeft: "-30%" }}
										>
											<span className="p-float-label">
												<h4>14. TOC Date*</h4>

												<Calendar
													placeholder="TOC Date"
													required
													value={v16}
													onChange={(e) => setv16(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>15. Scope of Contract*</h4>

												<InputTextarea
													placeholder="Preventive Maintenance Name"
													
													value={v17}
													onChange={(e) => setv17(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>16. Remarks*</h4>

												<InputTextarea
													placeholder="Remarks"
													
													value={v18}
													onChange={(e) => setv18(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-center"
											style={{ marginLeft: "-15%" }}
										>
											<span className="p-float-label">
												<h4>17. Date of Initiation for Technical Approval*</h4>

												<Calendar
													placeholder="Technical Approval Date"
													required
													value={v19}
													onChange={(e) => setv19(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>
													18. Date of Initiation for Administrative Approval*
												</h4>

												<Calendar
													placeholder="Administrative Approval Date"
													required
													value={v20}
													onChange={(e) => setv20(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>19. E-Office File reference number*</h4>

												<InputNumber
													size={50}
													placeholder="E-Office File reference number"
													inputId="integeronly"
													value={v21}
													onValueChange={(e) => setv21(e.value)}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-center"
											style={{ marginLeft: "-30%" }}
										>
											<span className="p-float-label">
												<h4>20. Name of Indenting Department*</h4>

												<Dropdown
													required
													value={v22}
													onChange={(e) => {
														setv22(e.value);
													}}
													options={departments}
													optionLabel="name"
													placeholder="Select Department"
													className="w-full md:w-14rem"
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>21. Scope of Work (Link)*</h4>

												<InputTextarea
													placeholder="Scope of Work"
													
													value={v25}
													onChange={(e) => setv25(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />

							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>22. Current Status of Proposal*</h4>

												<InputTextarea
													placeholder="Status of Proposal"
													
													value={v26}
													onChange={(e) => setv26(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-center"
											style={{ marginLeft: "-32%" }}
										>
											<span className="p-float-label">
												<h4>23. Bid Floating Date*</h4>

												<Calendar
													placeholder="Bid Floating Date"
													required
													value={v27}
													onChange={(e) => setv27(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>24. Technical Evaluation Report (Link)*</h4>

												<InputTextarea
													placeholder="Technical Evaluation Report"
													
													value={v28}
													onChange={(e) => setv28(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>25. Bid Opening Date (Technical)*</h4>

												<Calendar
													placeholder="Technical Bid Opening Date"
													required
													value={v29}
													onChange={(e) => setv29(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div className="card flex justify-content-center">
											<span className="p-float-label">
												<h4>26. Extension Details (Technical)*</h4>

												<InputTextarea
													placeholder="Extension Details"
													
													value={v30}
													onChange={(e) => setv30(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>27. Date of Technical Approval*</h4>

												<Calendar
													placeholder="Technical Approval Date"
													required
													value={v31}
													onChange={(e) => setv31(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>28. Bid Opening Date (Commercial)*</h4>

												<Calendar
													placeholder="Bid Opening Date"
													required
													value={v32}
													onChange={(e) => setv32(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div className="card flex justify-content-center">
											<span className="p-float-label">
												<h4>29. Commercial Evaluation Report (Link)*</h4>

												<InputTextarea
													placeholder="Commercial Evaluation Report"
													
													value={v33}
													onChange={(e) => setv33(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>30. Technical Committee Members*</h4>

												<InputTextarea
													placeholder="Technical Committee Members"
													
													value={v36}
													onChange={(e) => setv36(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>31. Start Date of Defect Liability*</h4>

												<Calendar
													placeholder="Defect Liability Date"
													required
													value={v40}
													onChange={(e) => setv40(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-center"
											style={{ marginLeft: "4%" }}
										>
											<span className="p-float-label">
												<h4>32. BG Value*</h4>

												<InputNumber
													size={50}
													placeholder="BG Value"
													inputId="integeronly"
													value={v41}
													onValueChange={(e) => setv41(e.value)}
													prefix="₹ "
													min={0}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>33. SD Value*</h4>

												<InputNumber
													size={50}
													placeholder="SD Value"
													inputId="integeronly"
													value={v42}
													onValueChange={(e) => setv42(e.value)}
													prefix="₹ "
													min={0}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>34. Liquidate Damage (%)*</h4>

												<InputNumber
													size={50}
													placeholder="Liquidate Damage (%)"
													inputId="integeronly"
													value={v43}
													onValueChange={(e) => setv43(e.value)}
													suffix=" %"
													min={0}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div className="card flex justify-content-center">
											<span className="p-float-label">
												<h4>35. Post Award Extension Details*</h4>

												<InputTextarea
													placeholder="Post Award Extension Details"
													
													value={v44}
													onChange={(e) => setv44(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>36. Actual Completion Date*</h4>

												<Calendar
													placeholder="Actual Completion Date"
													required
													value={v45}
													onChange={(e) => setv45(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>37. Completion Date as per LOA*</h4>

												<Calendar
													placeholder="Completion Date"
													required
													value={v46}
													onChange={(e) => setv46(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div className="card flex justify-content-center">
											<span className="p-float-label">
												<h4>38. Difficulties*</h4>

												<InputTextarea
													placeholder="Difficulties"
													
													value={v47}
													onChange={(e) => setv47(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>39. Terms of Payment*</h4>

												<InputTextarea
													placeholder="Terms of Payment"
													
													value={v48}
													onChange={(e) => setv48(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>40. Payment Details (Amount & Date)*</h4>

												<InputTextarea
													placeholder="Payment Details (Amount & Date)"
													
													value={v49}
													onChange={(e) => setv49(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-center"
											style={{ marginLeft: "5%" }}
										>
											<span className="p-float-label">
												<h4>
													41. No of Days Pending with Indenting Department*
												</h4>

												<InputNumber
													size={50}
													placeholder="Days Pending with Indenting"
													inputId="integeronly"
													value={v50}
													onValueChange={(e) => setv50(e.value)}
													suffix=" Days"
													min={0}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>42. No of Days Pending with CS Department*</h4>

												<InputNumber
													size={50}
													placeholder="Days Pending with CS"
													inputId="integeronly"
													value={v51}
													onValueChange={(e) => setv51(e.value)}
													suffix=" Days"
													min={0}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>43. No of Days Pending with F&A Department*</h4>

												<InputNumber
													size={50}
													placeholder="Days Pending with F&A"
													inputId="integeronly"
													value={v52}
													onValueChange={(e) => setv52(e.value)}
													suffix=" Days"
													min={0}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-center"
											style={{ marginLeft: "-32%" }}
										>
											<span className="p-float-label">
												<h4>44. Date of BG Submission*</h4>

												<Calendar
													placeholder="BG Submission Date"
													required
													value={v38}
													onChange={(e) => setv38(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>
						</TabPanel>

						{/* /////////////////////////////////////tab-6///////////////////////////////////////////////////////////            */}

						<TabPanel>
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>1. Name of Item/ Work*</h4>

												<InputTextarea
													placeholder="Name of Item/ Work"
													
													value={v1}
													onChange={(e) => setv1(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div className="card flex justify-content-center">
											<span className="p-float-label">
												<h4>2. Name of Agency*</h4>

												<InputTextarea
													placeholder="Name of Agency"
													
													value={v2}
													onChange={(e) => setv2(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>3. Present Status of Contract*</h4>

												<InputTextarea
													placeholder="Present Status of Contract"
													
													value={v3}
													onChange={(e) => setv3(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />

							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>4. Contract Type*</h4>

												<InputTextarea
													placeholder="Contract Type"
													
													value={v4}
													onChange={(e) => setv4(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div className="card flex justify-content-center">
											<span className="p-float-label">
												<h4>5. LOA No.*</h4>

												<InputNumber
													size={48}
													placeholder="LOA No."
													inputId="integeronly"
													value={v5}
													onValueChange={(e) => setv5(e.value)}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>6. LOA Link*</h4>

												<InputTextarea
													placeholder="LOA Link"
													
													value={v6}
													onChange={(e) => setv6(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />

							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>7. Technical Specification (Link)*</h4>

												<InputTextarea
													placeholder="Technical Specification (Link)"
													
													value={v7}
													onChange={(e) => setv7(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div className="card flex justify-content-center">
											<span className="p-float-label">
												<h4>8. Contract Period*</h4>

												<InputNumber
													size={48}
													placeholder="Contract Period"
													inputId="integeronly"
													value={v8}
													onValueChange={(e) => setv8(e.value)}
													suffix=" Years"
													min={0}
													max={10}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>9. Expiry Date of Defect Liability/ Warranty*</h4>

												<Calendar
													placeholder="Expiry Date of Defect Liability/ Warranty"
													required
													value={v9}
													onChange={(e) => setv9(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />

							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>10. AMC Start Date*</h4>

												<Calendar
													placeholder="AMC Start Date"
													required
													value={v10}
													onChange={(e) => setv10(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-center"
											style={{ marginLeft: "-32%" }}
										>
											<span className="p-float-label">
												<h4>11. AMC End Date*</h4>

												<Calendar
													placeholder="AMC End Date"
													required
													value={v11}
													onChange={(e) => setv11(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>12. Billing Cycle*</h4>

												<InputTextarea
													placeholder="Billing Cycle"
													
													value={v12}
													onChange={(e) => setv12(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />

							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>13. Engineer-In-charge (E-I-C)*</h4>

												<InputTextarea
													placeholder="(E-I-C)"
													
													value={v13}
													onChange={(e) => setv13(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-center"
											style={{ marginLeft: "0%" }}
										>
											<span className="p-float-label">
												<h4>14. Authorised Representative of E-I-C*</h4>

												<InputTextarea
													placeholder="Representative of E-I-C"
													
													value={v14}
													onChange={(e) => setv14(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>15. Esclation Matrix*</h4>

												<InputTextarea
													placeholder="Esclation Matrix"
													
													value={v15}
													onChange={(e) => setv15(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>16. TOC Date*</h4>

												<Calendar
													placeholder="TOC Date"
													required
													value={v16}
													onChange={(e) => setv16(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div className="card flex justify-content-center">
											<span className="p-float-label">
												<h4>17. Scope of Contract*</h4>

												<InputTextarea
													placeholder="Preventive Maintenance Name"
													
													value={v17}
													onChange={(e) => setv17(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>18. Remarks*</h4>

												<InputTextarea
													placeholder="Remarks"
													
													value={v18}
													onChange={(e) => setv18(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>19. Date of Initiation for Technical Approval*</h4>

												<Calendar
													placeholder="Technical Approval Date"
													required
													value={v19}
													onChange={(e) => setv19(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-center"
											style={{ marginLeft: "-5%" }}
										>
											<span className="p-float-label">
												<h4>
													20. Date of Initiation for Administrative Approval*
												</h4>

												<Calendar
													placeholder="Administrative Approval Date"
													required
													value={v20}
													onChange={(e) => setv20(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>21. E-Office File reference number*</h4>

												<InputNumber
													size={50}
													placeholder="E-Office File reference number"
													inputId="integeronly"
													value={v21}
													onValueChange={(e) => setv21(e.value)}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>22. Name of Indenting Department*</h4>

												<Dropdown
													required
													value={v22}
													onChange={(e) => {
														setv22(e.value);
													}}
													options={departments}
													optionLabel="name"
													placeholder="Select Department"
													className="w-full md:w-14rem"
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div className="card flex justify-content-center">
											<span className="p-float-label">
												<h4>23. Scope of Work (Link)*</h4>

												<InputTextarea
													placeholder="Scope of Work"
													
													value={v25}
													onChange={(e) => setv25(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>24. Current Status of Proposal*</h4>

												<InputTextarea
													placeholder="Status of Proposal"
													
													value={v26}
													onChange={(e) => setv26(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>25. Bid Floating Date*</h4>

												<Calendar
													placeholder="Bid Floating Date"
													required
													value={v27}
													onChange={(e) => setv27(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div className="card flex justify-content-center">
											<span className="p-float-label">
												<h4>26. Technical Evaluation Report (Link)*</h4>

												<InputTextarea
													placeholder="Technical Evaluation Report"
													
													value={v28}
													onChange={(e) => setv28(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>27. Bid Opening Date (Technical)*</h4>

												<Calendar
													placeholder="Technical Bid Opening Date"
													required
													value={v29}
													onChange={(e) => setv29(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>28. Extension Details (Technical)*</h4>

												<InputTextarea
													placeholder="Extension Details"
													
													value={v30}
													onChange={(e) => setv30(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-center"
											style={{ marginLeft: "-28%" }}
										>
											<span className="p-float-label">
												<h4>29. Date of Technical Approval*</h4>

												<Calendar
													placeholder="Technical Approval Date"
													required
													value={v31}
													onChange={(e) => setv31(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>30. Bid Opening Date (Commercial)*</h4>

												<Calendar
													placeholder="Bid Opening Date"
													required
													value={v32}
													onChange={(e) => setv32(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>31. Commercial Evaluation Report (Link)*</h4>

												<InputTextarea
													placeholder="Commercial Evaluation Report"
													
													value={v33}
													onChange={(e) => setv33(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div className="card flex justify-content-center">
											<span className="p-float-label">
												<h4>32. Technical Committee Members*</h4>

												<InputTextarea
													placeholder="Technical Committee Members"
													
													value={v36}
													onChange={(e) => setv36(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>33. Date of BG Submission*</h4>

												<Calendar
													placeholder="BG Submission Date"
													required
													value={v38}
													onChange={(e) => setv38(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>34. Start Date of Defect Liability*</h4>

												<Calendar
													placeholder="Defect Liability Date"
													required
													value={v40}
													onChange={(e) => setv40(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-center"
											style={{ marginLeft: "4%" }}
										>
											<span className="p-float-label">
												<h4>35. BG Value*</h4>

												<InputNumber
													size={50}
													placeholder="BG Value"
													inputId="integeronly"
													value={v41}
													onValueChange={(e) => setv41(e.value)}
													prefix="₹ "
													min={0}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>36. SD Value*</h4>

												<InputNumber
													size={50}
													placeholder="SD Value"
													inputId="integeronly"
													value={v42}
													onValueChange={(e) => setv42(e.value)}
													prefix="₹ "
													min={0}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>37. Liquidate Damage (%)*</h4>

												<InputNumber
													size={50}
													placeholder="Liquidate Damage (%)"
													inputId="integeronly"
													value={v43}
													onValueChange={(e) => setv43(e.value)}
													suffix=" %"
													min={0}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div className="card flex justify-content-center">
											<span className="p-float-label">
												<h4>38. Post Award Extension Details*</h4>

												<InputTextarea
													placeholder="Post Award Extension Details"
													
													value={v44}
													onChange={(e) => setv44(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>39. Actual Completion Date*</h4>

												<Calendar
													placeholder="Actual Completion Date"
													required
													value={v45}
													onChange={(e) => setv45(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>40. Completion Date as per LOA*</h4>

												<Calendar
													placeholder="Completion Date"
													required
													value={v46}
													onChange={(e) => setv46(e.value)}
													dateFormat="dd-MM-yy"
													monthNavigator
													yearNavigator
													yearRange="2015:2025"
													showButtonBar
													showIcon
													showWeek
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div className="card flex justify-content-center">
											<span className="p-float-label">
												<h4>41. Difficulties*</h4>

												<InputTextarea
													placeholder="Difficulties"
													
													value={v47}
													onChange={(e) => setv47(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>42. Terms of Payment*</h4>

												<InputTextarea
													placeholder="Terms of Payment"
													
													value={v48}
													onChange={(e) => setv48(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>43. Payment Details (Amount & Date)*</h4>

												<InputTextarea
													placeholder="Payment Details (Amount & Date)"
													
													value={v49}
													onChange={(e) => setv49(e.target.value)}
													rows={1}
													cols={50}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-center"
											style={{ marginLeft: "5%" }}
										>
											<span className="p-float-label">
												<h4>
													44. No of Days Pending with Indenting Department*
												</h4>

												<InputNumber
													size={50}
													placeholder="Days Pending with Indenting"
													inputId="integeronly"
													value={v50}
													onValueChange={(e) => setv50(e.value)}
													suffix=" Days"
													min={0}
												/>
											</span>
										</div>
									</Col>
									<Col sm={4}>
										<div
											className="card flex justify-content-right"
											style={{ marginLeft: "40%" }}
										>
											<span className="p-float-label">
												<h4>45. No of Days Pending with CS Department*</h4>

												<InputNumber
													size={50}
													placeholder="Days Pending with CS"
													inputId="integeronly"
													value={v51}
													onValueChange={(e) => setv51(e.value)}
													suffix=" Days"
													min={0}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>

							<Divider />
							<Container>
								<Row>
									<Col sm={4}>
										<div
											className="card flex justify-content-left"
											style={{ marginLeft: "-20%" }}
										>
											<span className="p-float-label">
												<h4>46. No of Days Pending with F&A Department*</h4>

												<InputNumber
													size={50}
													placeholder="Days Pending with F&A"
													inputId="integeronly"
													value={v52}
													onValueChange={(e) => setv52(e.value)}
													suffix=" Days"
													min={0}
												/>
											</span>
										</div>
									</Col>
								</Row>
							</Container>
						</TabPanel>

						{/* /////////////////////////////////////tab-7///////////////////////////////////////////////////////////            */}

						<TabPanel>
							<p className="m-0">TAB 7</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-8///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 8</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-9///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 9</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-10///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 10</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-11///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 11</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-12///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 12</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-13///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 13</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-14///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 14</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-15///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 15</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-16///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 16</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-17///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 17</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-18///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 18</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-19///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 19</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-20///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 20</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-21///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 21</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-22///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 22</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-23///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 23</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-24///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 24</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-25///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 25</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-26///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 26</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-27///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 27</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-28///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 28</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-29///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 29</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-30///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 30</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-31///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 31</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-32///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 32</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-33///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 33</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-34///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 34</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-35///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 35</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-36///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 36</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-37///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 37</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-38///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 38</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-39///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 39</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-40///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 40</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-41///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 41</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-42///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 42</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-43///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 43</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-44///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 44</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-45///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 45</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-46///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 46</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-47///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 47</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-48///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 48</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-49///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 49</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-50///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 50</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-51///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 51</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-52///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 52</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-53///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 53</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-54///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 54</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-55///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 55</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-56///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 56</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-57///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 57</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-58///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 58</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-59///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 59</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-60///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 60</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-61///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 61</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-62///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 62</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-63///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 63</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-64///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 64</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-65///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 65</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-66///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 66</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-67///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 67</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-68///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 68</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-69///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 69</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-70///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 70</p>
						</TabPanel>
						{/* /////////////////////////////////////tab-71///////////////////////////////////////////////////////////            */}
						<TabPanel>
							<p className="m-0">TAB 71</p>
						</TabPanel>
					</TabView>
				</div>

				{/* <Container>
          <Row>
            <Col sm={4}>
              <div
                className="card flex justify-content-left"
                style={{ marginLeft: "-20%" }}
              >
                <span className="p-float-label">
                  <h4>1. Name of Item/ Work*</h4>

                  <InputTextarea
                    placeholder="Name of Item/ Work"
                    
                    value={v1}
                    onChange={(e) => setv1(e.target.value)}
                    rows={1}
                    cols={50}
                  />
                </span>
              </div>
            </Col>
            <Col sm={4}>
              <div className="card flex justify-content-center">
                <span className="p-float-label">
                  <h4>2. Name of Agency*</h4>

                  <InputTextarea
                    placeholder="Name of Agency"
                    
                    value={v2}
                    onChange={(e) => setv2(e.target.value)}
                    rows={1}
                    cols={50}
                  />
                </span>
              </div>
            </Col>
            <Col sm={4}>
              <div
                className="card flex justify-content-right"
                style={{ marginLeft: "40%" }}
              >
                <span className="p-float-label">
                  <h4>3. Present Status of Contract*</h4>

                  <InputTextarea
                    placeholder="Present Status of Contract"
                    
                    value={v3}
                    onChange={(e) => setv3(e.target.value)}
                    rows={1}
                    cols={50}
                  />
                </span>
              </div>
            </Col>
          </Row>
        </Container>

        <Divider />

        <Container>
          <Row>
            <Col sm={4}>
              <div
                className="card flex justify-content-left"
                style={{ marginLeft: "-20%" }}
              >
                <span className="p-float-label">
                  <h4>4. Contract Type*</h4>

                  <InputTextarea
                    placeholder="Contract Type"
                    
                    value={v4}
                    onChange={(e) => setv4(e.target.value)}
                    rows={1}
                    cols={50}
                  />
                </span>
              </div>
            </Col>
            <Col sm={4}>
              <div className="card flex justify-content-center">
                <span className="p-float-label">
                  <h4>5. LOA No.*</h4>

                  <InputNumber
                    size={48}
                    placeholder="LOA No."
                    inputId="integeronly"
                    value={v5}
                    onValueChange={(e) => setv5(e.value)}
                  />
                </span>
              </div>
            </Col>
            <Col sm={4}>
              <div
                className="card flex justify-content-right"
                style={{ marginLeft: "40%" }}
              >
                <span className="p-float-label">
                  <h4>6. LOA Link*</h4>

                  <InputTextarea
                    placeholder="LOA Link"
                    
                    value={v6}
                    onChange={(e) => setv6(e.target.value)}
                    rows={1}
                    cols={50}
                  />
                </span>
              </div>
            </Col>
          </Row>
        </Container>

        <Divider />

        <Container>
          <Row>
            <Col sm={4}>
              <div
                className="card flex justify-content-left"
                style={{ marginLeft: "-20%" }}
              >
                <span className="p-float-label">
                  <h4>7. Technical Specification (Link)*</h4>

                  <InputTextarea
                    placeholder="Technical Specification (Link)"
                    
                    value={v7}
                    onChange={(e) => setv7(e.target.value)}
                    rows={1}
                    cols={50}
                  />
                </span>
              </div>
            </Col>
            <Col sm={4}>
              <div className="card flex justify-content-center">
                <span className="p-float-label">
                  <h4>8. Contract Period*</h4>

                  <InputNumber
                    size={48}
                    placeholder="Contract Period"
                    inputId="integeronly"
                    value={v8}
                    onValueChange={(e) => setv8(e.value)}
                    suffix=" Years"
                    min={0}
                    max={10}
                  />
                </span>
              </div>
            </Col>
            <Col sm={4}>
              <div
                className="card flex justify-content-right"
                style={{ marginLeft: "40%" }}
              >
                <span className="p-float-label">
                  <h4>9. Expiry Date of Defect Liability/ Warranty*</h4>

                  <Calendar
                    placeholder="Expiry Date of Defect Liability/ Warranty"
                    required
                    value={v9}
                    onChange={(e) => setv9(e.value)}
                    dateFormat="dd-MM-yy"
                    monthNavigator
                    yearNavigator
                    yearRange="2015:2025"
                    showButtonBar
                    showIcon
                    showWeek
                  />
                </span>
              </div>
            </Col>
          </Row>
        </Container>

        <Divider />

        <Container>
          <Row>
            <Col sm={4}>
              <div
                className="card flex justify-content-left"
                style={{ marginLeft: "-20%" }}
              >
                <span className="p-float-label">
                  <h4>10. AMC Start Date*</h4>

                  <Calendar
                    placeholder="AMC Start Date"
                    required
                    value={v10}
                    onChange={(e) => setv10(e.value)}
                    dateFormat="dd-MM-yy"
                    monthNavigator
                    yearNavigator
                    yearRange="2015:2025"
                    showButtonBar
                    showIcon
                    showWeek
                  />
                </span>
              </div>
            </Col>
            <Col sm={4}>
              <div
                className="card flex justify-content-center"
                style={{ marginLeft: "-32%" }}
              >
                <span className="p-float-label">
                  <h4>11. AMC End Date*</h4>

                  <Calendar
                    placeholder="AMC End Date"
                    required
                    value={v11}
                    onChange={(e) => setv11(e.value)}
                    dateFormat="dd-MM-yy"
                    monthNavigator
                    yearNavigator
                    yearRange="2015:2025"
                    showButtonBar
                    showIcon
                    showWeek
                  />
                </span>
              </div>
            </Col>
            <Col sm={4}>
              <div
                className="card flex justify-content-right"
                style={{ marginLeft: "40%" }}
              >
                <span className="p-float-label">
                  <h4>12. Billing Cycle*</h4>

                  <InputTextarea
                    placeholder="Billing Cycle"
                    
                    value={v12}
                    onChange={(e) => setv12(e.target.value)}
                    rows={1}
                    cols={50}
                  />
                </span>
              </div>
            </Col>
          </Row>
        </Container>

        <Divider />

        <Container>
          <Row>
            <Col sm={4}>
              <div
                className="card flex justify-content-left"
                style={{ marginLeft: "-20%" }}
              >
                <span className="p-float-label">
                  <h4>13. Engineer-In-charge (E-I-C)*</h4>

                  <InputTextarea
                    placeholder="(E-I-C)"
                    
                    value={v13}
                    onChange={(e) => setv13(e.target.value)}
                    rows={1}
                    cols={50}
                  />
                </span>
              </div>
            </Col>
            <Col sm={4}>
              <div
                className="card flex justify-content-center"
                style={{ marginLeft: "0%" }}
              >
                <span className="p-float-label">
                  <h4>14. Authorised Representative of E-I-C*</h4>

                  <InputTextarea
                    placeholder="Representative of E-I-C"
                    
                    value={v14}
                    onChange={(e) => setv14(e.target.value)}
                    rows={1}
                    cols={50}
                  />
                </span>
              </div>
            </Col>
            <Col sm={4}>
              <div
                className="card flex justify-content-right"
                style={{ marginLeft: "40%" }}
              >
                <span className="p-float-label">
                  <h4>15. Esclation Matrix*</h4>

                  <InputTextarea
                    placeholder="Esclation Matrix"
                    
                    value={v15}
                    onChange={(e) => setv15(e.target.value)}
                    rows={1}
                    cols={50}
                  />
                </span>
              </div>
            </Col>
          </Row>
        </Container>

        <Divider />
        <Container>
          <Row>
            <Col sm={4}>
              <div
                className="card flex justify-content-left"
                style={{ marginLeft: "-20%" }}
              >
                <span className="p-float-label">
                  <h4>16. TOC Date*</h4>

                  <Calendar
                    placeholder="TOC Date"
                    required
                    value={v16}
                    onChange={(e) => setv16(e.value)}
                    dateFormat="dd-MM-yy"
                    monthNavigator
                    yearNavigator
                    yearRange="2015:2025"
                    showButtonBar
                    showIcon
                    showWeek
                  />
                </span>
              </div>
            </Col>
            <Col sm={4}>
              <div className="card flex justify-content-center">
                <span className="p-float-label">
                  <h4>17. Scope of Contract*</h4>

                  <InputTextarea
                    placeholder="Preventive Maintenance Name"
                    
                    value={v17}
                    onChange={(e) => setv17(e.target.value)}
                    rows={1}
                    cols={50}
                  />
                </span>
              </div>
            </Col>
            <Col sm={4}>
              <div
                className="card flex justify-content-right"
                style={{ marginLeft: "40%" }}
              >
                <span className="p-float-label">
                  <h4>18. Remarks*</h4>

                  <InputTextarea
                    placeholder="Remarks"
                    
                    value={v18}
                    onChange={(e) => setv18(e.target.value)}
                    rows={1}
                    cols={50}
                  />
                </span>
              </div>
            </Col>
          </Row>
        </Container>

        <Divider />
        <Container>
          <Row>
            <Col sm={4}>
              <div
                className="card flex justify-content-left"
                style={{ marginLeft: "-20%" }}
              >
                <span className="p-float-label">
                  <h4>19. Date of Initiation for Technical Approval*</h4>

                  <Calendar
                    placeholder="Technical Approval Date"
                    required
                    value={v19}
                    onChange={(e) => setv19(e.value)}
                    dateFormat="dd-MM-yy"
                    monthNavigator
                    yearNavigator
                    yearRange="2015:2025"
                    showButtonBar
                    showIcon
                    showWeek
                  />
                </span>
              </div>
            </Col>
            <Col sm={4}>
              <div
                className="card flex justify-content-center"
                style={{ marginLeft: "-5%" }}
              >
                <span className="p-float-label">
                  <h4>20. Date of Initiation for Administrative Approval*</h4>

                  <Calendar
                    placeholder="Administrative Approval Date"
                    required
                    value={v20}
                    onChange={(e) => setv20(e.value)}
                    dateFormat="dd-MM-yy"
                    monthNavigator
                    yearNavigator
                    yearRange="2015:2025"
                    showButtonBar
                    showIcon
                    showWeek
                  />
                </span>
              </div>
            </Col>
            <Col sm={4}>
              <div
                className="card flex justify-content-right"
                style={{ marginLeft: "40%" }}
              >
                <span className="p-float-label">
                  <h4>21. E-Office File reference number*</h4>

                  <InputNumber
                    size={50}
                    placeholder="E-Office File reference number"
                    inputId="integeronly"
                    value={v21}
                    onValueChange={(e) => setv21(e.value)}
                  />
                </span>
              </div>
            </Col>
          </Row>
        </Container>

        <Divider />
        <Container>
          <Row>
            <Col sm={4}>
              <div
                className="card flex justify-content-left"
                style={{ marginLeft: "-20%" }}
              >
                <span className="p-float-label">
                  <h4>22. Name of Indenting Department*</h4>

                  <Dropdown
                    required
                    value={v22}
                    onChange={(e) => {
                      setv22(e.value);
                    }}
                    options={departments}
                    optionLabel="name"
                    placeholder="Select Department"
                    className="w-full md:w-14rem"
                  />
                </span>
              </div>
            </Col>
            <Col sm={4}>
              <div
                className="card flex justify-content-center"
                style={{ marginLeft: "5%" }}
              >
                <span className="p-float-label">
                  <h4>23. Estimate Value (excl GST)*</h4>

                  <InputNumber
                    size={50}
                    placeholder="Estimate Value"
                    inputId="integeronly"
                    value={v23}
                    onValueChange={(e) => setv23(e.value)}
                    prefix="₹ "
                    min={0}
                  />
                </span>
              </div>
            </Col>
            <Col sm={4}>
              <div
                className="card flex justify-content-right"
                style={{ marginLeft: "40%" }}
              >
                <span className="p-float-label">
                  <h4>24. Estimate Value (incl GST)*</h4>

                  <InputNumber
                    size={50}
                    placeholder="Estimate Value"
                    inputId="integeronly"
                    value={v24}
                    onValueChange={(e) => setv24(e.value)}
                    prefix="₹ "
                    min={0}
                  />
                </span>
              </div>
            </Col>
          </Row>
        </Container>

        <Divider />
        <Container>
          <Row>
            <Col sm={4}>
              <div
                className="card flex justify-content-left"
                style={{ marginLeft: "-20%" }}
              >
                <span className="p-float-label">
                  <h4>25. Scope of Work (Link)*</h4>

                  <InputTextarea
                    placeholder="Scope of Work"
                    
                    value={v25}
                    onChange={(e) => setv25(e.target.value)}
                    rows={1}
                    cols={50}
                  />
                </span>
              </div>
            </Col>
            <Col sm={4}>
              <div className="card flex justify-content-center">
                <span className="p-float-label">
                  <h4>26. Current Status of Proposal*</h4>

                  <InputTextarea
                    placeholder="Status of Proposal"
                    
                    value={v26}
                    onChange={(e) => setv26(e.target.value)}
                    rows={1}
                    cols={50}
                  />
                </span>
              </div>
            </Col>
            <Col sm={4}>
              <div
                className="card flex justify-content-right"
                style={{ marginLeft: "40%" }}
              >
                <span className="p-float-label">
                  <h4>27. Bid Floating Date*</h4>

                  <Calendar
                    placeholder="Bid Floating Date"
                    required
                    value={v27}
                    onChange={(e) => setv27(e.value)}
                    dateFormat="dd-MM-yy"
                    monthNavigator
                    yearNavigator
                    yearRange="2015:2025"
                    showButtonBar
                    showIcon
                    showWeek
                  />
                </span>
              </div>
            </Col>
          </Row>
        </Container>

        <Divider />
        <Container>
          <Row>
            <Col sm={4}>
              <div
                className="card flex justify-content-left"
                style={{ marginLeft: "-20%" }}
              >
                <span className="p-float-label">
                  <h4>28. Technical Evaluation Report (Link)*</h4>

                  <InputTextarea
                    placeholder="Technical Evaluation Report"
                    
                    value={v28}
                    onChange={(e) => setv28(e.target.value)}
                    rows={1}
                    cols={50}
                  />
                </span>
              </div>
            </Col>
            <Col sm={4}>
              <div
                className="card flex justify-content-center"
                style={{ marginLeft: "-32%" }}
              >
                <span className="p-float-label">
                  <h4>29. Bid Opening Date (Technical)*</h4>

                  <Calendar
                    placeholder="Technical Bid Opening Date"
                    required
                    value={v29}
                    onChange={(e) => setv29(e.value)}
                    dateFormat="dd-MM-yy"
                    monthNavigator
                    yearNavigator
                    yearRange="2015:2025"
                    showButtonBar
                    showIcon
                    showWeek
                  />
                </span>
              </div>
            </Col>
            <Col sm={4}>
              <div
                className="card flex justify-content-right"
                style={{ marginLeft: "40%" }}
              >
                <span className="p-float-label">
                  <h4>30. Extension Details (Technical)*</h4>

                  <InputTextarea
                    placeholder="Extension Details"
                    
                    value={v30}
                    onChange={(e) => setv30(e.target.value)}
                    rows={1}
                    cols={50}
                  />
                </span>
              </div>
            </Col>
          </Row>
        </Container>

        <Divider />
        <Container>
          <Row>
            <Col sm={4}>
              <div
                className="card flex justify-content-left"
                style={{ marginLeft: "-20%" }}
              >
                <span className="p-float-label">
                  <h4>31. Date of Technical Approval*</h4>

                  <Calendar
                    placeholder="Technical Approval Date"
                    required
                    value={v31}
                    onChange={(e) => setv31(e.value)}
                    dateFormat="dd-MM-yy"
                    monthNavigator
                    yearNavigator
                    yearRange="2015:2025"
                    showButtonBar
                    showIcon
                    showWeek
                  />
                </span>
              </div>
            </Col>
            <Col sm={4}>
              <div
                className="card flex justify-content-center"
                style={{ marginLeft: "-28%" }}
              >
                <span className="p-float-label">
                  <h4>32. Bid Opening Date (Commercial)*</h4>

                  <Calendar
                    placeholder="Bid Opening Date"
                    required
                    value={v32}
                    onChange={(e) => setv32(e.value)}
                    dateFormat="dd-MM-yy"
                    monthNavigator
                    yearNavigator
                    yearRange="2015:2025"
                    showButtonBar
                    showIcon
                    showWeek
                  />
                </span>
              </div>
            </Col>
            <Col sm={4}>
              <div
                className="card flex justify-content-right"
                style={{ marginLeft: "40%" }}
              >
                <span className="p-float-label">
                  <h4>33. Commercial Evaluation Report (Link)*</h4>

                  <InputTextarea
                    placeholder="Commercial Evaluation Report"
                    
                    value={v33}
                    onChange={(e) => setv33(e.target.value)}
                    rows={1}
                    cols={50}
                  />
                </span>
              </div>
            </Col>
          </Row>
        </Container>

        <Divider />
        <Container>
          <Row>
            <Col sm={4}>
              <div
                className="card flex justify-content-left"
                style={{ marginLeft: "-20%" }}
              >
                <span className="p-float-label">
                  <h4>34. Date of Opening of Reverse Auction*</h4>

                  <Calendar
                    placeholder="Reverse Auction Opening Date"
                    required
                    value={v34}
                    onChange={(e) => setv34(e.value)}
                    dateFormat="dd-MM-yy"
                    monthNavigator
                    yearNavigator
                    yearRange="2015:2025"
                    showButtonBar
                    showIcon
                    showWeek
                  />
                </span>
              </div>
            </Col>
            <Col sm={4}>
              <div
                className="card flex justify-content-center"
                style={{ marginLeft: "-24%" }}
              >
                <span className="p-float-label">
                  <h4>35. Date of Closing of Reverse Auction*</h4>

                  <Calendar
                    placeholder="Reverse Auction Closing Date"
                    required
                    value={v35}
                    onChange={(e) => setv35(e.value)}
                    dateFormat="dd-MM-yy"
                    monthNavigator
                    yearNavigator
                    yearRange="2015:2025"
                    showButtonBar
                    showIcon
                    showWeek
                  />
                </span>
              </div>
            </Col>
            <Col sm={4}>
              <div
                className="card flex justify-content-right"
                style={{ marginLeft: "40%" }}
              >
                <span className="p-float-label">
                  <h4>36. Technical Committee Members*</h4>

                  <InputTextarea
                    placeholder="Technical Committee Members"
                    
                    value={v36}
                    onChange={(e) => setv36(e.target.value)}
                    rows={1}
                    cols={50}
                  />
                </span>
              </div>
            </Col>
          </Row>
        </Container>

        <Divider />
        <Container>
          <Row>
            <Col sm={4}>
              <div
                className="card flex justify-content-left"
                style={{ marginLeft: "-20%" }}
              >
                <span className="p-float-label">
                  <h4>37. Details of Contract Closing*</h4>

                  <InputTextarea
                    placeholder="Details of Contract Closing"
                    
                    value={v37}
                    onChange={(e) => setv37(e.target.value)}
                    rows={1}
                    cols={50}
                  />
                </span>
              </div>
            </Col>
            <Col sm={4}>
              <div
                className="card flex justify-content-center"
                style={{ marginLeft: "-32%" }}
              >
                <span className="p-float-label">
                  <h4>38. Date of BG Submission*</h4>

                  <Calendar
                    placeholder="BG Submission Date"
                    required
                    value={v38}
                    onChange={(e) => setv38(e.value)}
                    dateFormat="dd-MM-yy"
                    monthNavigator
                    yearNavigator
                    yearRange="2015:2025"
                    showButtonBar
                    showIcon
                    showWeek
                  />
                </span>
              </div>
            </Col>
            <Col sm={4}>
              <div
                className="card flex justify-content-right"
                style={{ marginLeft: "40%" }}
              >
                <span className="p-float-label">
                  <h4>39. Negotiation Details (Link)*</h4>

                  <InputTextarea
                    placeholder="Negotiation Details"
                    
                    value={v39}
                    onChange={(e) => setv39(e.target.value)}
                    rows={1}
                    cols={50}
                  />
                </span>
              </div>
            </Col>
          </Row>
        </Container>

        <Divider />
        <Container>
          <Row>
            <Col sm={4}>
              <div
                className="card flex justify-content-left"
                style={{ marginLeft: "-20%" }}
              >
                <span className="p-float-label">
                  <h4>40. Start Date of Defect Liability*</h4>

                  <Calendar
                    placeholder="Defect Liability Date"
                    required
                    value={v40}
                    onChange={(e) => setv40(e.value)}
                    dateFormat="dd-MM-yy"
                    monthNavigator
                    yearNavigator
                    yearRange="2015:2025"
                    showButtonBar
                    showIcon
                    showWeek
                  />
                </span>
              </div>
            </Col>
            <Col sm={4}>
              <div
                className="card flex justify-content-center"
                style={{ marginLeft: "4%" }}
              >
                <span className="p-float-label">
                  <h4>41. BG Value*</h4>

                  <InputNumber
                    size={50}
                    placeholder="BG Value"
                    inputId="integeronly"
                    value={v41}
                    onValueChange={(e) => setv41(e.value)}
                    prefix="₹ "
                    min={0}
                  />
                </span>
              </div>
            </Col>
            <Col sm={4}>
              <div
                className="card flex justify-content-right"
                style={{ marginLeft: "40%" }}
              >
                <span className="p-float-label">
                  <h4>42. SD Value*</h4>

                  <InputNumber
                    size={50}
                    placeholder="SD Value"
                    inputId="integeronly"
                    value={v42}
                    onValueChange={(e) => setv42(e.value)}
                    prefix="₹ "
                    min={0}
                  />
                </span>
              </div>
            </Col>
          </Row>
        </Container>

        <Divider />
        <Container>
          <Row>
            <Col sm={4}>
              <div
                className="card flex justify-content-left"
                style={{ marginLeft: "-20%" }}
              >
                <span className="p-float-label">
                  <h4>43. Liquidate Damage (%)*</h4>

                  <InputNumber
                    size={50}
                    placeholder="Liquidate Damage (%)"
                    inputId="integeronly"
                    value={v43}
                    onValueChange={(e) => setv43(e.value)}
                    suffix=" %"
                    min={0}
                  />
                </span>
              </div>
            </Col>
            <Col sm={4}>
              <div className="card flex justify-content-center">
                <span className="p-float-label">
                  <h4>44. Post Award Extension Details*</h4>

                  <InputTextarea
                    placeholder="Post Award Extension Details"
                    
                    value={v44}
                    onChange={(e) => setv44(e.target.value)}
                    rows={1}
                    cols={50}
                  />
                </span>
              </div>
            </Col>
            <Col sm={4}>
              <div
                className="card flex justify-content-right"
                style={{ marginLeft: "40%" }}
              >
                <span className="p-float-label">
                  <h4>45. Actual Completion Date*</h4>

                  <Calendar
                    placeholder="Actual Completion Date"
                    required
                    value={v45}
                    onChange={(e) => setv45(e.value)}
                    dateFormat="dd-MM-yy"
                    monthNavigator
                    yearNavigator
                    yearRange="2015:2025"
                    showButtonBar
                    showIcon
                    showWeek
                  />
                </span>
              </div>
            </Col>
          </Row>
        </Container>

        <Divider />
        <Container>
          <Row>
            <Col sm={4}>
              <div
                className="card flex justify-content-left"
                style={{ marginLeft: "-20%" }}
              >
                <span className="p-float-label">
                  <h4>46. Completion Date as per LOA*</h4>

                  <Calendar
                    placeholder="Completion Date"
                    required
                    value={v46}
                    onChange={(e) => setv46(e.value)}
                    dateFormat="dd-MM-yy"
                    monthNavigator
                    yearNavigator
                    yearRange="2015:2025"
                    showButtonBar
                    showIcon
                    showWeek
                  />
                </span>
              </div>
            </Col>
            <Col sm={4}>
              <div className="card flex justify-content-center">
                <span className="p-float-label">
                  <h4>47. Difficulties*</h4>

                  <InputTextarea
                    placeholder="Difficulties"
                    
                    value={v47}
                    onChange={(e) => setv47(e.target.value)}
                    rows={1}
                    cols={50}
                  />
                </span>
              </div>
            </Col>
            <Col sm={4}>
              <div
                className="card flex justify-content-right"
                style={{ marginLeft: "40%" }}
              >
                <span className="p-float-label">
                  <h4>48. Terms of Payment*</h4>

                  <InputTextarea
                    placeholder="Terms of Payment"
                    
                    value={v48}
                    onChange={(e) => setv48(e.target.value)}
                    rows={1}
                    cols={50}
                  />
                </span>
              </div>
            </Col>
          </Row>
        </Container>

        <Divider />
        <Container>
          <Row>
            <Col sm={4}>
              <div
                className="card flex justify-content-left"
                style={{ marginLeft: "-20%" }}
              >
                <span className="p-float-label">
                  <h4>49. Payment Details (Amount & Date)*</h4>

                  <InputTextarea
                    placeholder="Payment Details (Amount & Date)"
                    
                    value={v49}
                    onChange={(e) => setv49(e.target.value)}
                    rows={1}
                    cols={50}
                  />
                </span>
              </div>
            </Col>
            <Col sm={4}>
              <div
                className="card flex justify-content-center"
                style={{ marginLeft: "5%" }}
              >
                <span className="p-float-label">
                  <h4>50. No of Days Pending with Indenting Department*</h4>

                  <InputNumber
                    size={50}
                    placeholder="Days Pending with Indenting"
                    inputId="integeronly"
                    value={v50}
                    onValueChange={(e) => setv50(e.value)}
                    suffix=" Days"
                    min={0}
                  />
                </span>
              </div>
            </Col>
            <Col sm={4}>
              <div
                className="card flex justify-content-right"
                style={{ marginLeft: "40%" }}
              >
                <span className="p-float-label">
                  <h4>51. No of Days Pending with CS Department*</h4>

                  <InputNumber
                    size={50}
                    placeholder="Days Pending with CS"
                    inputId="integeronly"
                    value={v51}
                    onValueChange={(e) => setv51(e.value)}
                    suffix=" Days"
                    min={0}
                  />
                </span>
              </div>
            </Col>
          </Row>
        </Container>

        <Divider />
        <Container>
          <Row>
            <Col sm={4}>
              <div
                className="card flex justify-content-left"
                style={{ marginLeft: "-20%" }}
              >
                <span className="p-float-label">
                  <h4>52. No of Days Pending with F&A Department*</h4>

                  <InputNumber
                    size={50}
                    placeholder="Days Pending with F&A"
                    inputId="integeronly"
                    value={v52}
                    onValueChange={(e) => setv52(e.value)}
                    suffix=" Days"
                    min={0}
                  />
                </span>
              </div>
            </Col>
          </Row>
        </Container> */}

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
					<h3>I've Filled all Data Correctly and wish to Submit</h3>
				</div>
				<br />
				<div className="card flex justify-content-center">
					<Toast ref={toast} />
					<div className="flex flex-wrap gap-2">
						<Button
							disabled={!checked}
							label="Submit Data"
							className="p-button-success"
							onClick={submit_data}
						/>
					</div>
				</div>
			</Fieldset>

			{/* //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
		</>
	);
}
export default Input;
