import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import "../cssFiles/PasswordDemo.css";
import "../cssFiles/ButtonDemo.css";

import axios from "axios";
import { Button } from "primereact/button";
import { Fieldset } from "primereact/fieldset";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import jwt_decode from "jwt-decode";
import { FileUpload } from "primereact/fileupload";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { Container, Row, Col } from "react-grid-system";
import { Divider } from "primereact/divider";
import moment from "moment";
import { InputSwitch } from "primereact/inputswitch";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { InputText } from "primereact/inputtext";
import { SplitButton } from "primereact/splitbutton";
// Import styles
function Contracts(params) {
	const search = useLocation().search;
	const id = new URLSearchParams(search).get("token");
	const [initial_api_data, set_initial_api_data] = useState([]);
	const [show_table, set_show_table] = useState(true);
	const toast = useRef();
	const [file_link, setfile_link] = useState([]);
	const [file_button_data, setfile_button_data] = useState([]);
	const [delete_confirm_box, setdelete_confirm_box] = useState(false);
	const [edit_confirm_box, setedit_confirm_box] = useState(false);
	const [page_hide, setPage_hide] = useState(true);
	const [show_desc, setshow_desc] = useState(false);
	const [basic_details_bol, setbasic_details_bol] = useState(true);
	params.var4(page_hide);
	const [User_id, setUser_id] = useState();
	const [delete_row, set_delete_row] = useState();
	const [Selected_department, setSelected_department] = useState();
	const [Person_Name, setPerson_Name] = useState();
	const [Edit_visible, setEdit_visible] = useState(false);
	// const [zoomvalue, setzoomvalue] = useState(1);
	const [pageno, setpageno] = useState();
	const [Contract_Name, setContract_Name] = useState();
	const [Short_Description, setShort_Description] = useState();
	const [Contract_Award_Date, setContract_Award_Date] = useState();
	const [Seller_Name, setSeller_Name] = useState();
	const [Contract_Period, setContract_Period] = useState();
	const [CP_tristate_value, setCP_tristate_value] = useState();
	const [CP_y_m_d, setCP_y_m_d] = useState(" Years");
	const [Contract_Start_Date, setContract_Start_Date] = useState(null);
	const [Contract_End_Date, setContract_End_Date] = useState();
	const [Contract_Value, setContract_Value] = useState();
	const [E_I_C, setE_I_C] = useState();
	const [Supply_end_date, setSupply_end_date] = useState(null);

	const [isAdmin, setisAdmin] = useState(false);
	const [AdminChecked, setAdminChecked] = useState(false);
	const [table_header, settable_header] = useState();
	const [row_edit_data, setrow_edit_data] = useState();

	const [Supply_Service_bol, setSupply_Service_bol] = useState(false);
	const [Supply_bol, setSupply_bol] = useState(false);
	const [Service_bol, setService_bol] = useState(false);
	const [Subscription_bol, setSubscription_bol] = useState(false);
	const [BOQ_upload_bol, setBOQ_upload_bol] = useState(false);
	const [File, setFile] = useState([]);

	const [Installation_end_date, setInstallation_end_date] = useState();
	const [Toc_date, setToc_date] = useState();
	const [Maintenance_period, setMaintenance_period] = useState();
	const [SD_BG_opted, setSD_BG_opted] = useState({
		name: "-Select-",
		code: false,
	});
	const [Sd_Bg_file_name, setSd_Bg_file_name] = useState();
	const [SD_BG_amount, setSD_BG_amount] = useState();
	const [BG_expiry_date, setBG_expiry_date] = useState();
	const [Subscription_start_date, setSubscription_start_date] = useState();
	const [Subscription_end_date, setSubscription_end_date] = useState();
	const [Warranty_period, setWarranty_period] = useState();
	const [Service_start_date, setService_start_date] = useState();
	const [Service_period, setService_period] = useState(null);
	const [Temp_row_data, setTemp_row_data] = useState();
	const SD_BG_options = [
		{ name: "Yes", code: true },
		{ name: "No", code: false },
	];
	const [entry_no, setentry_no] = useState();
	const [Wr_y_m_d, setWr_y_m_d] = useState(" Years");
	const [Wr_tristate_value, setWr_tristate_value] = useState();
	const [SP_y_m_d, setSP_y_m_d] = useState(" Years");
	const [SP_tristate_value, setSP_tristate_value] = useState();
	const [Mp_y_m_d, setMp_y_m_d] = useState(" Years");
	const [Mp_tristate_value, setMp_tristate_value] = useState();

	const [filters, setFilters] = useState({
		global: { value: null, matchMode: FilterMatchMode.CONTAINS },
		Contract_Name: {
			operator: FilterOperator.AND,
			constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
		},
		Contract_Reference_No: {
			operator: FilterOperator.AND,
			constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
		},
		Contract_Type: { value: null, matchMode: FilterMatchMode.CONTAINS },

		Contract_Platform: { value: null, matchMode: FilterMatchMode.CONTAINS },
		Contract_Period: { value: null, matchMode: FilterMatchMode.CONTAINS },

		Contract_Award_Date: {
			operator: FilterOperator.AND,
			constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
		},
		Contract_End_Date: {
			operator: FilterOperator.AND,
			constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
		},
		Contract_Start_Date: {
			operator: FilterOperator.AND,
			constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
		},
	});
	const [globalFilterValue, setGlobalFilterValue] = useState("");

	const items = [
		{
			label: "Update",
			icon: "pi pi-upload",
			command: () => {
				// toast.current.show({
				// 	severity: "success",
				// 	summary: "Updated",
				// 	detail: "Data Updated",
				// });
				setBOQ_upload_bol(true);
			},
		},
		{
			label: "Delete",
			icon: "pi pi-times",
			command: () => {
				axios
					.post("http://10.3.200.63:5011/delete_boq?File_Name=" + pageno, {})
					.then((response) => {
						setfile_link(["No file was Uploaded"]);

						if (response.data === "done") {
							get_Contracts_data();
							toast.current.show({
								severity: "warn",
								summary: "Delete",
								detail: "Data Deleted",
							});
						} else {
							alert("Delete Failed");
						}
					})
					.catch((error) => {});
			},
		},
		{
			label: "View",
			icon: "pi pi-external-link",
			command: () => {
				setPDFvisible(true);
			},
		},
	];

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

	const [PDFvisible, setPDFvisible] = useState(false);

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
						setPage_hide(true);
					} else if (response.data === "Bad Token") {
						alert("Unauthorised Access, Please login via SSO again");
						window.location = "https://sso.erldc.in:3000";
						setPage_hide(true);
					} else {
						var decoded = jwt_decode(response.data["Final_Token"], "it@posoco");

						if (decoded["Login"] && decoded["Reason"] === "Session Expired") {
							alert("session Expired, Please Login Again via SSO");

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
							setPage_hide(!decoded["Login"]);
							setPerson_Name(decoded["Person_Name"]);

							if (
								decoded["Department"] === "IT-TS" ||
								decoded["Department"] === "IT"
							) {
								setSelected_department("Information Technology");
								setisAdmin(false);
							}

							if (
								decoded["Department"] === "MO" ||
								decoded["Department"] === "MO-I" ||
								decoded["Department"] === "MO-II" ||
								decoded["Department"] === "MO-III" ||
								decoded["Department"] === "MO-IV"
							) {
								setSelected_department("Market Operation");
								setisAdmin(false);
							}

							if (
								decoded["Department"] === "MIS" ||
								decoded["Department"] === "SS" ||
								decoded["Department"] === "CR" ||
								decoded["Department"] === "SO"
							) {
								setSelected_department("System Operation");
								setisAdmin(false);
							}

							if (decoded["Department"] === "SCADA") {
								setSelected_department("SCADA");
								setisAdmin(false);
							}

							if (decoded["Department"] === "CS") {
								setSelected_department("Contracts & Services");
								setisAdmin(true);
							}

							if (decoded["Department"] === "TS") {
								setSelected_department("Technical Services");
								setisAdmin(false);
							}

							if (decoded["Department"] === "HR") {
								setSelected_department("Human Resource");
								setisAdmin(false);
							}

							if (decoded["Department"] === "COMMUNICATION") {
								setSelected_department("Communication");
								setisAdmin(false);
							}

							if (decoded["Department"] === "F&A") {
								setSelected_department("Finance & Accounts");
								setisAdmin(false);
							}

							if (
								decoded["User"] === "00162" &&
								decoded["Person_Name"] === "Sanjay Kumar"
							) {
								setisAdmin(true);
							}
						}
					}
				})
				.catch((error) => {});
		} else {
			setPage_hide(true);
		}

		if (CP_tristate_value === undefined || CP_tristate_value === null) {
			setCP_y_m_d(" Years");
		} else if (CP_tristate_value) {
			setCP_y_m_d(" Months");
		} else {
			setCP_y_m_d(" Days");
		}

		if (Wr_tristate_value === undefined || Wr_tristate_value === null) {
			setWr_y_m_d(" Years");
		} else if (Wr_tristate_value) {
			setWr_y_m_d(" Months");
		} else {
			setWr_y_m_d(" Days");
		}

		if (SP_tristate_value === undefined || SP_tristate_value === null) {
			setSP_y_m_d(" Years");
		} else if (SP_tristate_value) {
			setSP_y_m_d(" Months");
		} else {
			setSP_y_m_d(" Days");
		}

		if (Mp_tristate_value === undefined || Mp_tristate_value === null) {
			setMp_y_m_d(" Years");
		} else if (Mp_tristate_value) {
			setMp_y_m_d(" Months");
		} else {
			setMp_y_m_d(" Days");
		}
	}, [
		Selected_department,
		User_id,
		page_hide,
		Person_Name,
		initial_api_data,
		CP_y_m_d,
		CP_tristate_value,
		SP_tristate_value,
		SP_y_m_d,
	]);

	const get_Contracts_data = () => {
		axios
			.post(
				"http://10.3.200.63:5011/getcontractsData?Department=" +
					Selected_department +
					"&Admin=" +
					AdminChecked,

				{}
			)
			.then((response) => {
				set_initial_api_data(response.data);

				showSuccess();
				set_show_table(false);

				var headers = [];

				for (var k = 0; k < response.data.length; k++) {
					headers = [...headers, ...Object.keys(response.data[k])];
				}

				headers = Array.from(new Set(headers));

				headers.splice(0, 1);
				var index = headers.indexOf("Short_Description");
				headers.splice(index, 1);

				var index1 = headers.indexOf("Entry_No");
				headers.splice(index1, 1);

				var index2 = headers.indexOf("Expired_Mail_Sent");
				headers.splice(index2, 1);

				var index3 = headers.indexOf("Intending_Department");
				headers.splice(index3, 1);

				var index4 = headers.indexOf("Service_period");
				headers.splice(index4, 1);

				var index5 = headers.indexOf("Supply_end_date");
				headers.splice(index5, 1);

				var index6 = headers.indexOf("Type");
				headers.splice(index6, 1);

				settable_header(headers);
			})

			.catch((error) => {});
	};

	const showSuccess = () => {
		toast.current.show({
			severity: "success",
			summary: "Data Downloaded",
			detail: "Data Fetched Successfully",
			life: 3000,
		});
	};

	const accept = () => {
		delete_data(delete_row);
		DeleteCancel("updated");
	};
	const reject = () => {
		toast.current.show({
			severity: "error",
			summary: "Cancelled",
			detail: "Deletion Cancelled",
			life: 3000,
		});
		setdelete_confirm_box(false);
	};

	const editaccept = () => {
		update_data();
	};

	const editreject = () => {
		toast.current.show({
			severity: "error",
			summary: "Cancelled",
			detail: "Deletion Cancelled",
			life: 3000,
		});
		setedit_confirm_box(false);
		setrow_edit_data();
	};

	const info = () => {
		toast.current.show({
			severity: "info",
			summary: "Editing Started",
			detail: "Carefully Edit Data",
			life: 3000,
		});
	};

	const fileButton = (data) => {
		if (
			data.BOQ_File_Name === "No file was Uploaded" ||
			data.BOQ_File_Name[0] === "No file was Uploaded" ||
			data.BOQ_File_Name.length === 0
		) {
			setfile_button_data(data);
			return (
				<Button
					size="x-small"
					tooltip="Click to Upload"
					icon="pi pi-upload"
					rounded
					outlined
					raised
					severity="danger"
					aria-label="Search"
					onClick={() => {
						setBOQ_upload_bol(true);
						setTemp_row_data(data);
						setentry_no(data["Entry_No"]);
					}}
				/>
			);
		} else {
			const downloadFile = () => {
				window.location.href =
					"http://10.3.200.63:5011/download?File_Name=" + data.BOQ_File_Name;
			};
			return (
				<Button
					size="small"
					tooltip="Click to Download"
					icon="pi pi-download"
					rounded
					raised
					severity="success"
					aria-label="Search"
					onClick={downloadFile}
				/>
			);
		}
	};

	const DeleteCancel = (e) => {
		if (e) {
			toast.current.show({
				severity: "info",
				summary: "Deleted",
				detail: "Entry Deleted",
				life: 3000,
			});
		}
	};

	const delete_data = (rowData) => {
		var index = initial_api_data.indexOf(rowData);

		if (index !== -1) {
			initial_api_data.splice(index, 1);
			axios
				.get("http://10.3.200.63:5011/delete", {
					headers: {
						datas: JSON.stringify(rowData),
					},
				})
				.then((response) => {
					if (response.data === "Success") {
						set_initial_api_data([...initial_api_data]);
					} else {
						toast.current.show({
							severity: "error",
							summary: "Cancelled",
							detail: "Update Cancelled",
							life: 3000,
						});
					}
				})
				.catch((error) => {});
		}
	};

	const DeleteBodyTemplate = (rowData) => {
		var tooltip_com = "Delete This Entry";

		return (
			<div className="card flex justify-content-center">
				<Button
					severity="danger"
					raised
					rounded
					tooltip={tooltip_com}
					tooltipOptions={{ position: "bottom" }}
					style={{ fontSize: "small" }}
					icon="pi pi-delete-left"
					onClick={() => {
						setdelete_confirm_box(true);
						set_delete_row(rowData);
					}}
				/>
			</div>
		);
	};

	const showDesc = (e) => {
		setshow_desc(true);

		if (
			e["BOQ_File_Name"] === "No file was Uploaded" ||
			e["BOQ_File_Name"][0] === "No file was Uploaded" ||
			e["BOQ_File_Name"].length === 0
		) {
			setfile_link(["No file was Uploaded"]);
		} else {
			setfile_link(e["BOQ_File_Name"]);
		}
		setpageno(e["BOQ_File_Name"][0]);

		setv1(e.Contract_Award_Date); // done
		setv2(e.Contract_End_Date); // done
		setv3(e.Contract_Name); // done
		setv4(e.Contract_Period); // done
		setv5(e.Contract_Platform); // done

		setv6(e.Contract_Reference_No); // done
		setv7(e.Contract_Start_Date); // done
		setv8(e.Contract_Type); // done
		setv9("₹ " + e.Contract_Value); // done
		setv10(e.E_I_C); // done

		setv11(e.Entry_No);
		setv12(e.Expired_Mail_Sent);
		setv13(e.Intending_Department); // done
		setv14(e.Seller_Name); // done
		setv15(e.Short_Description); // done
		setv18(e.Type); // done

		// if (e.Service_period && e.Supply_end_date) {
		// 	setv16(e.Service_period); // done
		// 	setv17(e.Supply_end_date);
		// } else {
		// 	setv16("Not Applicable"); // done
		// 	setv17("Not Applicable"); // done
		// }
	};

	const DescBodyTemplate = (e) => {
		return (
			<>
				<Button
					severity="info"
					size="small"
					raised
					rounded
					label="Expand"
					icon="pi pi-link"
					onClick={() => {
						showDesc(e);
					}}
				></Button>
			</>
		);
	};

	const editing = (rowData) => {
		info();
		setEdit_visible(true);

		setSupply_end_date();

		if (rowData.Contract_Type.toLowerCase() === "supply + service") {
			setSupply_Service_bol(true);
			setSupply_bol(false);
			setService_bol(false);
			setSubscription_bol(false);
		} else if (rowData.Contract_Type.toLowerCase() === "supply") {
			setSupply_Service_bol(false);
			setSupply_bol(true);
			setService_bol(false);
			setSubscription_bol(false);
		} else if (rowData.Contract_Type.toLowerCase() === "service") {
			setSupply_Service_bol(false);
			setSupply_bol(false);
			setService_bol(true);
			setSubscription_bol(false);
		} else if (rowData.Contract_Type.toLowerCase() === "subscription") {
			setSupply_Service_bol(false);
			setSupply_bol(false);
			setService_bol(false);
			setSubscription_bol(true);
		}
	};
	// console.log(CP_tristate_value);
	const edit_page = (rowData) => {
		// if (rowData.Supply_end_date && rowData.Service_period) {
		// 	setSupply_end_date(
		// 		new Date(
		// 			moment()
		// 				.set("day", Number(rowData.Supply_end_date.split("-")[0]) - 22)
		// 				.set("month", Number(rowData.Supply_end_date.split("-")[1]) - 1)
		// 				.set("year", Number(rowData.Supply_end_date.split("-")[2]))
		// 		)
		// 	);

		// }
		setrow_edit_data(rowData);
		setContract_Name(rowData.Contract_Name);
		setShort_Description(rowData.Short_Description);
		setSeller_Name(rowData.Seller_Name);

		setContract_Period(Number(rowData.Contract_Period.split(" ")[0]));

		setContract_Award_Date(
			new Date(
				moment()
					.set("day", Number(rowData.Contract_Award_Date.split("-")[0]) - 22)
					.set("month", Number(rowData.Contract_Award_Date.split("-")[1]) - 1)
					.set("year", Number(rowData.Contract_Award_Date.split("-")[2]))
			)
		);

		setContract_Start_Date(
			new Date(
				moment()
					.set("day", Number(rowData.Contract_Start_Date.split("-")[0]) - 22)
					.set("month", Number(rowData.Contract_Start_Date.split("-")[1]) - 1)
					.set("year", Number(rowData.Contract_Start_Date.split("-")[2]))
			)
		);

		setContract_End_Date(
			new Date(
				moment()
					.set("day", Number(rowData.Contract_End_Date.split("-")[0]) - 22)
					.set("month", Number(rowData.Contract_End_Date.split("-")[1]) - 1)
					.set("year", Number(rowData.Contract_End_Date.split("-")[2]))
			)
		);

		setContract_Value(rowData.Contract_Value);
		setE_I_C(rowData.E_I_C);

		if (rowData.Contract_Period.split(" ")[1] === "Years") {
			setCP_tristate_value();
		} else if (rowData.Contract_Period.split(" ")[1] === "Months") {
			setCP_tristate_value(true);
		} else if (rowData.Contract_Period.split(" ")[1] === "Days") {
			setCP_tristate_value(false);
		}

		// if (rowData.Service_period.split(" ")[1] === "Years") {
		// 	setSP_tristate_value();
		// } else if (rowData.Service_period.split(" ")[1] === "Months") {
		// 	setSP_tristate_value(true);
		// } else if (rowData.Service_period.split(" ")[1] === "Days") {
		// 	setSP_tristate_value(false);
		// }

		if (
			rowData["BOQ_File_Name"] === "No file was Uploaded" ||
			rowData["BOQ_File_Name"][0] === "No file was Uploaded" ||
			rowData["BOQ_File_Name"].length === 0
		) {
			setfile_link(["No file was Uploaded"]);
		} else {
			setfile_link(rowData["BOQ_File_Name"]);
		}
		setpageno(rowData["BOQ_File_Name"][0]);

		setv1(rowData.Contract_Award_Date); // done
		setv2(rowData.Contract_End_Date); // done
		setv3(rowData.Contract_Name); // done
		setv4(Number(rowData.Contract_Period.split(" ")[0])); // done
		setv5(rowData.Contract_Platform); // done

		setv6(rowData.Contract_Reference_No); // done
		setv7(rowData.Contract_Start_Date); // done
		setv8(rowData.Contract_Type); // done
		setv9("₹ " + rowData.Contract_Value); // done
		setv10(rowData.E_I_C); // done

		setv11(rowData.Entry_No);
		setv12(rowData.Expired_Mail_Sent);
		setv13(rowData.Intending_Department); // done
		setv14(rowData.Seller_Name); // done
		setv15(rowData.Short_Description); // done
		setv18(rowData.Type); // done

		// if (rowData.Service_period && rowData.Supply_end_date) {
		// 	setv16(rowData.Service_period); // done
		// 	setv17(rowData.Supply_end_date);
		// } else {
		// 	setv16("Not Applicable"); // done
		// 	setv17("Not Applicable"); // done
		// }
	};

	const EditBodyTemplate = (rowData) => {
		var tooltip_co = "Edit This Entry";

		return (
			<>
				<div className="card flex justify-content-center">
					<Button
						severity="warning"
						raised
						rounded
						tooltip={tooltip_co}
						tooltipOptions={{ position: "bottom" }}
						// label="Show"
						style={{ fontSize: "small" }}
						icon="pi pi-file-edit"
						onClick={() => {
							editing(rowData);
							edit_page(rowData);
							setentry_no(rowData["Entry_No"]);
						}}
					/>
				</div>
			</>
		);
	};

	const rowClassName = (data) =>
		moment(data["Contract_End_Date"], "DD-MM-YYYY").toDate() > moment().toDate()
			? (moment(data["Contract_End_Date"], "DD-MM-YYYY")
					.toDate()
					.getFullYear() -
					moment().toDate().getFullYear()) *
					12 +
					(moment(data["Contract_End_Date"], "DD-MM-YYYY").toDate().getMonth() -
						moment().toDate().getMonth()) <
			  4
				? "p-abouttoexpire"
				: "p-nonexpired"
			: "p-expired";

	const update_data = () => {
		row_edit_data.Contract_Name = Contract_Name;
		row_edit_data.Contract_Period = Contract_Period + " " + CP_y_m_d;
		row_edit_data.Short_Description = Short_Description;
		row_edit_data.Seller_Name = Seller_Name;
		row_edit_data.Contract_Value = Contract_Value;
		row_edit_data.E_I_C = E_I_C;
		row_edit_data.Contract_Start_Date =
			moment(Contract_Start_Date).format("DD-MM-YYYY");
		row_edit_data.Contract_End_Date =
			moment(Contract_End_Date).format("DD-MM-YYYY");
		row_edit_data.Contract_Award_Date =
			moment(Contract_Award_Date).format("DD-MM-YYYY");

		// if (Supply_Service_bol) {
		// 	if (Supply_end_date && Service_period) {
		// 		row_edit_data["Supply_end_date"] =
		// 			moment(Supply_end_date).format("DD-MM-YYYY");
		// 		row_edit_data["Service_period"] = Service_period + " " + SP_y_m_d;

		// 		setEdit_visible(false);
		// 	} else {
		// 		alert("Supply details must be filled");
		// 	}
		// } else {
		// 	setEdit_visible(false);
		// }
		axios
			.get("http://10.3.200.63:5011/Contractsupdate", {
				headers: {
					datas: JSON.stringify(row_edit_data),
				},
			})
			.then((response) => {
				get_Contracts_data();
			})
			.catch((error) => {});
	};

	const Sd_Bg_file = (e) => {
		var filenames = [];
		for (var i = 0; i < e.files.length; i++) {
			filenames = [...filenames, ...[e.files[i].name]];
		}
		let arr = [...Sd_Bg_file_name, ...filenames];

		setSd_Bg_file_name([...new Set(arr)]);
	};

	// const inserted_footerContent = (
	// 	<div>
	// 		<Button
	// 			label="OK"
	// 			icon="pi pi-check"
	// 			onClick={() => {
	// 				setBOQ_upload_bol(false);
	// 				setFile([]);
	// 				// navigate("/Contracts?token=" + id);
	// 			}}
	// 			autoFocus
	// 		/>
	// 	</div>
	// );

	const onGlobalFilterChange = (e) => {
		const value = e.target.value;
		let _filters = { ...filters };

		_filters["global"].value = value;

		setFilters(_filters);
		setGlobalFilterValue(value);
	};

	const renderHeader = () => {
		return (
			<div className="flex flex-wrap gap-1 justify-content-between align-items-center">
				Contracts Data
				<span className="p-input-icon-left">
					<i className="pi pi-search" />
					<InputText
						size="small"
						value={globalFilterValue}
						onChange={onGlobalFilterChange}
						placeholder="Search"
					/>
				</span>
			</div>
		);
	};

	const header = renderHeader();

	const file_name1 = (e) => {
		var filenames = [];
		for (var i = 0; i < e.files.length; i++) {
			var ext = e.files[i].name.split(".");

			filenames = [
				...filenames,
				...["File_" + entry_no + String(i + 1) + "." + ext[ext.length - 1]],
			];
		}
		let arr = [...File, ...filenames];

		setFile([...new Set(arr)]);
	};

	if (File.length !== 0) {
		var final_row_data = Temp_row_data;
		final_row_data["BOQ_File_Name"] = File;

		axios
			.get("http://10.3.200.63:5011/Contractsupdate", {
				headers: {
					datas: JSON.stringify(final_row_data),
				},
			})
			.then((response) => {
				if (response.data === "Success") {
					get_Contracts_data();
					setBOQ_upload_bol(false);
					setFile([]);
					toast.current.show({
						severity: "success",
						summary: "BOQ Uploaded",
						detail: "BOQ Files Uploaded Successfully",
						life: 3000,
					});
				} else {
					setFile([]);
					toast.current.show({
						severity: "warning",
						summary: "BOQ Uploaded Failed",
						detail: "BOQ Files not Uploaded",
						life: 3000,
					});
				}
			})
			.catch((error) => {});
	}

	const pricetemplate = (product) => {
		return <>₹ {product.Contract_Value}</>;
	};

	return (
		<>
			<div className="card flex justify-content-center">
				<Dialog
					header={"BOQ:" + pageno}
					visible={PDFvisible}
					style={{ width: "40vw" }}
					onHide={() => setPDFvisible(false)}
					maximizable
				>
					<p className="mb-5">
						<html>
							<head></head>
							<body>
								<center>
									<iframe
										src={"Uploaded_Files/" + pageno}
										width="100%"
										height="1000"
										zoomvalue="50"
										frameborder="0"
									></iframe>
								</center>
							</body>
						</html>
					</p>
				</Dialog>
			</div>
			<Dialog
				header="Upload BOQ File"
				visible={BOQ_upload_bol}
				style={{ width: "50vw" }}
				onHide={() => setBOQ_upload_bol(false)}
				// footer={inserted_footerContent}
			>
				<Container>
					<Row>
						<Col sm={12}>
							<div className="card flex justify-content-center">
								<span className="p-float-label" style={{ width: "100%" }}>
									{/* <h4>Upload BOQ</h4> */}

									<FileUpload
										chooseLabel={"Select Files"}
										cancelLabel={"Clear All"}
										previewWidth={300}
										name="demo[]"
										onUpload={file_name1}
										url={"http://10.3.200.63:5011/upload?entry=" + entry_no}
										accept="pdf/*"
										maxFileSize={50000000}
										// multiple
										emptyTemplate={
											<p className="m-0">Drag and drop relevant BOQ file.</p>
										}
									/>
								</span>
							</div>
						</Col>
					</Row>
				</Container>
			</Dialog>

			<Fieldset hidden={!page_hide}>
				<div className="card flex justify-content-center">
					<h1>Please Login again by SSO</h1>
				</div>
			</Fieldset>

			<Toast ref={toast} />

			<div className="card flex justify-content-center">
				<Dialog
					// maximizable
					maximized
					header={
						<>
							<Container style={{ marginTop: "0%", marginBottom: "-10%" }}>
								<div
									className="flex justify-content-left"
									style={{ marginLeft: "-10%" }}
								>
									<span className="p-input-icon-left">
										All Details (Entry No:{v11} )
									</span>
								</div>
							</Container>
						</>
					}
					footer={
						<>
							<div style={{ marginTop: "0.2%", marginBottom: "-1.1%" }}>
								<Button
									size="small"
									severity="danger"
									raised
									rounded
									label="Close"
									icon="pi pi-times"
									onClick={() => {
										setshow_desc(false);
									}}
								/>
							</div>
						</>
					}
					visible={show_desc}
					style={{ width: "50vw" }}
					onHide={() => {
						setshow_desc(false);
					}}
				>
					{/* <Splitter style={{ height: "auto" }}>
						<SplitterPanel size={65} minSize={65}> */}
					<Container>
						<Row>
							<Col sm={12}>
								<div className="flex flex-wrap gap-1 justify-content-between align-items-center">
									<div className="field">
										<span className="p-float-label">
											<h4>Contract Name:</h4>
											<InputTextarea
												placeholder="Engineer in Charge"
												value={v3}
												rows={1}
												cols={40}
												// onChange={(e) => setE_I_C(e.target.value)}
											/>
										</span>
									</div>
									<div className="field">
										<span className="p-float-label">
											<h4>Contract Type:</h4>
											<InputText
												value={v8}
												// onChange={(e) => setE_I_C(e.target.value)}
											/>
										</span>
									</div>
									<div className="field">
										<span className="p-float-label">
											<h4>Contract Period:</h4>
											<InputText
												value={v4}
												size={10}
												// onChange={(e) => setE_I_C(e.target.value)}
											/>
										</span>
									</div>
									<div className="field">
										<span className="p-float-label">
											<h4>Contract Award Date:</h4>

											<InputText
												value={v1}
												size={10}
												// onChange={(e) => setE_I_C(e.target.value)}
											/>
										</span>
									</div>
									<div className="field">
										<span className="p-float-label">
											<h4>Contract Start Date:</h4>

											<InputText
												value={v7}
												// onChange={(e) => setE_I_C(e.target.value)}
												size={10}
											/>
										</span>
									</div>
									<div className="field">
										<span className="p-float-label">
											<h4>Contract End Date:</h4>

											<InputText
												value={v2}
												// onChange={(e) => setE_I_C(e.target.value)}
												size={10}
											/>
										</span>
									</div>
								</div>
							</Col>
						</Row>
					</Container>

					<Divider />
					<Container>
						<Row>
							<Col sm={6}>
								<div className="card flex justify-content-left">
									<span className="p-float-label">
										<h4>Description of the Contract:</h4>

										<InputTextarea
											placeholder="Engineer in Charge"
											value={v15}
											// onChange={(e) => setE_I_C(e.target.value)}
											rows={3}
											cols={163}
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
								<div className="flex flex-wrap gap-1 justify-content-between align-items-center">
									<div className="field">
										<span className="p-float-label">
											<h4>Contract Value</h4>

											<InputText
												value={v9}
												// onChange={(e) => setE_I_C(e.target.value)}
												size={6}
											/>
										</span>
									</div>
									<div className="field">
										<span className="p-float-label">
											<h4>Seller Name:</h4>

											<InputTextarea
												value={v14}
												// onChange={(e) => setE_I_C(e.target.value)}
												rows={1}
												cols={30}
											/>
										</span>
									</div>
									<div className="field">
										<span className="p-float-label">
											<h4>Engineer in charge</h4>

											<InputTextarea
												value={v10}
												// onChange={(e) => setE_I_C(e.target.value)}
												rows={1}
												cols={30}
											/>
										</span>
									</div>
									<div className="field">
										<span className="p-float-label">
											<h4>Intending Department</h4>

											<InputTextarea
												value={v13}
												// onChange={(e) => setE_I_C(e.target.value)}
												rows={1}
												cols={25}
											/>
										</span>
									</div>
									<div className="field">
										<span className="p-float-label">
											<h4>Contract Refence no:</h4>

											<InputTextarea
												value={v6}
												// onChange={(e) => setE_I_C(e.target.value)}
												rows={1}
												cols={40}
											/>
										</span>
									</div>
								</div>
							</Col>
						</Row>
					</Container>

					<Divider />
					<Container>
						<Row>
							<Col sm={12}>
								<div className="flex flex-wrap gap-1 justify-content-between align-items-center">
									<div className="field">
										<span className="p-float-label">
											<h4>Contract Platform:</h4>

											<InputText
												value={v5}
												// onChange={(e) => setE_I_C(e.target.value)}
												size={10}
											/>
										</span>
									</div>

									<div className="field">
										<span className="p-float-label">
											<h4>Contract Type</h4>

											<InputTextarea
												value={v18}
												// onChange={(e) => setE_I_C(e.target.value)}
												rows={1}
												cols={13}
											/>
										</span>
									</div>

									<div className="field">
										<span className="p-float-label">
											<h4>Mail Sent</h4>

											<InputTextarea
												value={v12}
												// onChange={(e) => setE_I_C(e.target.value)}
												rows={1}
												cols={15}
											/>
										</span>
									</div>

									<div className="field">
										<span className="p-float-label">
											<h4>Attachments: (Click to View)</h4>
											{file_link.map((e) =>
												e === "No file was Uploaded" ? (
													<>
														<h4>No File Found</h4>
													</>
												) : (
													<Col sm={5}>
														<Button
															size="small"
															text
															severity="danger"
															label={"BOQ:" + e}
															onClick={() => {
																setpageno(e);
																setPDFvisible(true);
															}}
														/>
													</Col>
												)
											)}
										</span>
									</div>
								</div>
							</Col>
						</Row>
					</Container>
				</Dialog>
			</div>

			<ConfirmDialog
				visible={delete_confirm_box}
				onHide={() => setdelete_confirm_box(false)}
				message="Are you sure you want to delete this entry?"
				header="Confirm Delete"
				icon="pi pi-exclamation-triangle"
				accept={accept}
				reject={reject}
			/>

			<ConfirmDialog
				visible={edit_confirm_box}
				onHide={() => setedit_confirm_box(false)}
				message="Are you sure you want to edit this entry?"
				header="Confirm Edit"
				icon="pi pi-exclamation-triangle"
				accept={editaccept}
				reject={editreject}
			/>

			<Fieldset
				hidden={page_hide}
				style={{ marginTop: "-0.9%" }}
				legend={
					<div className="flex align-items-center ">
						<span
							className="pi pi-eye"
							style={{ fontWeight: "bold", fontSize: "small" }}
						></span>
						<span>Contracts Department Data</span>
					</div>
				}
			>
				<div
					style={{ marginTop: "-0.9%" }}
					className="card flex justify-content-center"
					hidden={!isAdmin}
				>
					<h4
						hidden={!isAdmin}
						style={{ marginTop: "-1.5%", marginLeft: "-1%" }}
					>
						Admin Mode
					</h4>
					<br />
					<div hidden={!isAdmin} style={{ marginLeft: "-4%" }}>
						<InputSwitch
							disabled={!isAdmin}
							style={{ marginLeft: "-6%" }}
							checked={AdminChecked}
							onChange={(e) => setAdminChecked(e.value)}
						/>
					</div>
				</div>
				<br />
				<div
					style={{ marginTop: "-0.9%", marginBottom: "-0.9%" }}
					className="card flex justify-content-center"
				>
					<Button
						size="small"
						icon="pi pi-download"
						severity="help"
						raised
						rounded
						label="Fetch Contracts Data"
						aria-label="Your Data"
						onClick={() => {
							get_Contracts_data();
						}}
					/>
				</div>
			</Fieldset>

			<div
				className="card"
				hidden={false}
				style={{
					width: "auto",
					whitespace: "nowrap",
				}}
			>
				{!show_table ? (
					<>
						<DataTable
							filters={filters}
							header={header}
							dataKey="id"
							globalFilterFields={[
								"Contract_Name",
								"Contract_Reference_No",
								"Contract_Type",
								"Contract_Platform",
								"Contract_Period",
								"Contract_Award_Date",
								"Contract_End_Date",
								"Contract_Start_Date",
							]}
							emptyMessage="Nothing found."
							paginator
							scrollable
							rows={5}
							rowsPerPageOptions={[5, 10, 15, initial_api_data.length]}
							tableStyle={{ minWidth: "50rem" }}
							paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
							currentPageReportTemplate="Showing {first} to {last} of {totalRecords} contracts"
							scrollHeight="500px"
							className="mt-4"
							value={initial_api_data}
							showGridlines
							rowClassName={rowClassName}
						>
							<Column
								align={"center"}
								style={{
									maxWidth: "4rem",
									minWidth: "4rem",
									wordBreak: "break-word",
								}}
								header="BOQ"
								body={fileButton}
								headerClassName="p-delete"
							></Column>
							{table_header.map((e) =>
								e === "Contract_Value" ? (
									<Column
										body={pricetemplate}
										style={{
											maxWidth: "5rem",
											minWidth: "5rem",
											wordBreak: "break-word",
										}}
										field={e}
										header={e}
										bodyClassName="p-common"
										headerClassName="p-delete"
									></Column>
								) : e === "Contract_Award_Date" ? (
									<Column
										style={{
											maxWidth: "5rem",
											minWidth: "5rem",
											wordBreak: "break-word",
										}}
										field={e}
										header={e}
										bodyClassName="p-common"
										headerClassName="p-delete"
									></Column>
								) : e === "Contract_End_Date" ? (
									<Column
										style={{
											maxWidth: "5rem",
											minWidth: "5rem",
											wordBreak: "break-word",
										}}
										field={e}
										header={e}
										bodyClassName="p-price"
										headerClassName="p-delete"
									></Column>
								) : e === "Contract_Period" ? (
									<Column
										style={{
											maxWidth: "4rem",
											minWidth: "4rem",
											wordBreak: "break-word",
										}}
										field={e}
										header={e}
										bodyClassName="p-common"
										headerClassName="p-delete"
									></Column>
								) : e === "Contract_Start_Date" ? (
									<Column
										style={{
											maxWidth: "5rem",
											minWidth: "5rem",
											wordBreak: "break-word",
										}}
										field={e}
										header={e}
										bodyClassName="p-common"
										headerClassName="p-delete"
									></Column>
								) : e === "Contract_Platform" ? (
									<Column
										style={{
											maxWidth: "5rem",
											minWidth: "5rem",
											wordBreak: "break-word",
										}}
										field={e}
										header={e}
										bodyClassName="p-common"
										headerClassName="p-delete"
									></Column>
								) : e === "Contract_Type" ? (
									<Column
										style={{
											maxWidth: "6rem",
											minWidth: "5rem",
											wordBreak: "break-word",
										}}
										field={e}
										header={e}
										bodyClassName="p-common"
										headerClassName="p-delete"
									></Column>
								) : (
									<Column
										style={{
											maxWidth: "11rem",
											minWidth: "4rem",
											wordBreak: "break-word",
										}}
										field={e}
										header={e}
										bodyClassName="p-common"
										headerClassName="p-delete"
									></Column>
								)
							)}

							<Column
								style={{
									maxWidth: "6rem",
									minWidth: "6rem",
									wordBreak: "break-word",
								}}
								header="More Details"
								body={DescBodyTemplate}
								headerClassName="p-delete"
							></Column>
							<Column
								// hidden={!AdminChecked}
								style={{
									maxWidth: "4rem",
									minWidth: "4rem",
									wordBreak: "break-word",
								}}
								header="Edit"
								body={EditBodyTemplate}
								headerClassName="p-delete"
							></Column>
							<Column
								hidden={!AdminChecked}
								style={{
									maxWidth: "4rem",
									minWidth: "4rem",
									wordBreak: "break-word",
								}}
								header="Delete"
								body={DeleteBodyTemplate}
								headerClassName="p-delete"
							></Column>
						</DataTable>
					</>
				) : (
					<></>
				)}
			</div>

			<div className="card flex justify-content-center">
				<Dialog
					// maximizable
					maximized
					header={
						<>
							<div className="flex flex-wrap gap-1 justify-content-between align-items-center">
								<div className="field">"Subscription Details"</div>
								<div className="field"></div>
								<div className="field">
									<Button
										text
										severity="danger"
										label="Click to add different Contract's details"
										// icon="pi pi-plus"
										// className="p-button-outlined"
										onClick={(e) => setbasic_details_bol(!basic_details_bol)}
									></Button>
								</div>
								<div className="field"></div>
								<div className="field"></div>
								<div className="field"></div>
							</div>
						</>
					}
					footer={
						<>
							<Button
								disabled={!Edit_visible}
								label="Save"
								className="p-button-success"
								onClick={() => {
									setedit_confirm_box(true);
								}}
							/>
						</>
					}
					visible={Edit_visible}
					style={{ width: "50vw" }}
					onHide={() => {
						setSupply_end_date(null);
						setEdit_visible(false);
						setSD_BG_opted({
							name: "-Select-",
							code: false,
						});
					}}
				>
					<Container>
						<Row>
							<Col sm={12}>
								<div className="flex flex-wrap gap-1 justify-content-between align-items-center">
									<div className="field">
										<span className="p-float-label">
											<h4>Contract Name:</h4>
											<InputTextarea
												placeholder="Engineer in Charge"
												value={v3}
												rows={1}
												cols={40}
												// onChange={(e) => setE_I_C(e.target.value)}
											/>
										</span>
									</div>
									<div className="field">
										<span className="p-float-label">
											<h4>Contract Type:</h4>
											<InputText
												value={v8}
												// onChange={(e) => setE_I_C(e.target.value)}
											/>
										</span>
									</div>
									<div className="field">
										<span className="p-float-label">
											<h4>
												Contract Period {CP_y_m_d}*{" "}
												<TriStateCheckbox
													// disabled={!Supply_Service_bol}
													value={CP_tristate_value}
													onChange={(e) => setCP_tristate_value(e.value)}
													// className="p-invalid"
												/>
											</h4>

											<InputText
												// disabled={!Supply_Service_bol}
												value={v4}
												onChange={(e) => {
													setv4(e.value);
												}}
												suffix={CP_tristate_value}
											/>
										</span>
									</div>
									<div className="field">
										<span className="p-float-label">
											<h4>Contract Period:</h4>
											<InputText
												value={v4}
												size={10}
												// onChange={(e) => setE_I_C(e.target.value)}
											/>
										</span>
									</div>
									<div className="field">
										<span className="p-float-label">
											<h4>Contract Award Date:</h4>

											<InputText
												value={v1}
												size={10}
												// onChange={(e) => setE_I_C(e.target.value)}
											/>
										</span>
									</div>
									<div className="field">
										<span className="p-float-label">
											<h4>Contract Start Date:</h4>

											<InputText
												value={v7}
												// onChange={(e) => setE_I_C(e.target.value)}
												size={10}
											/>
										</span>
									</div>
									<div className="field">
										<span className="p-float-label">
											<h4>Contract End Date:</h4>

											<InputText
												value={v2}
												// onChange={(e) => setE_I_C(e.target.value)}
												size={10}
											/>
										</span>
									</div>
								</div>
							</Col>
						</Row>
					</Container>

					<Divider />
					<Container>
						<Row>
							<Col sm={6}>
								<div className="card flex justify-content-left">
									<span className="p-float-label">
										<h4>Description of the Contract:</h4>

										<InputTextarea
											placeholder="Engineer in Charge"
											value={v15}
											// onChange={(e) => setE_I_C(e.target.value)}
											rows={3}
											cols={163}
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
								<div className="flex flex-wrap gap-1 justify-content-between align-items-center">
									<div className="field">
										<span className="p-float-label">
											<h4>Seller Name:</h4>

											<InputTextarea
												value={v14}
												// onChange={(e) => setE_I_C(e.target.value)}
												rows={1}
												cols={30}
											/>
										</span>
									</div>
									<div className="field">
										<span className="p-float-label">
											<h4>Engineer in charge</h4>

											<InputTextarea
												value={v10}
												// onChange={(e) => setE_I_C(e.target.value)}
												rows={1}
												cols={30}
											/>
										</span>
									</div>
									<div className="field">
										<span className="p-float-label">
											<h4>Intending Department</h4>

											<InputTextarea
												value={v13}
												// onChange={(e) => setE_I_C(e.target.value)}
												rows={1}
												cols={25}
											/>
										</span>
									</div>
									<div className="field">
										<span className="p-float-label">
											<h4>Contract Refence no:</h4>

											<InputTextarea
												value={v6}
												// onChange={(e) => setE_I_C(e.target.value)}
												rows={1}
												cols={60}
											/>
										</span>
									</div>
								</div>
							</Col>
						</Row>
					</Container>

					<Divider />
					<Container>
						<div className="flex flex-wrap gap-1 justify-content-between align-items-center">
							<div className="field">
								<span className="p-float-label">
									<h4>Contract Value</h4>

									<InputText
										value={v9}
										// onChange={(e) => setE_I_C(e.target.value)}
										size={6}
									/>
								</span>
							</div>
							<div className="field">
								<span className="p-float-label">
									<h4>Contract Platform:</h4>

									<InputText
										value={v5}
										// onChange={(e) => setE_I_C(e.target.value)}
										size={10}
									/>
								</span>
							</div>

							<div className="field">
								<span className="p-float-label">
									<h4>Contract Type</h4>

									<InputTextarea
										value={v18}
										// onChange={(e) => setE_I_C(e.target.value)}
										rows={1}
										cols={13}
									/>
								</span>
							</div>

							<div className="field">
								<span className="p-float-label">
									<h4>Mail Sent</h4>

									<InputTextarea
										value={v12}
										// onChange={(e) => setE_I_C(e.target.value)}
										rows={1}
										cols={15}
									/>
								</span>
							</div>

							<div className="field">
								<span className="p-float-label">
									<h4>Attachments: (Click to View/Upload)</h4>

									{file_link.map((e) =>
										e === "No file was Uploaded" ? (
											<>
												<Button
													size="small"
													text
													severity="danger"
													label="No File Found (Click to Upload)"
													onClick={() => {
														setBOQ_upload_bol(true);
														setTemp_row_data(file_button_data);
														setentry_no(file_button_data["Entry_No"]);
													}}
												/>
											</>
										) : (
											<>
												<SplitButton
													size="small"
													label={"BOQ:" + e}
													icon="pi pi-file-pdf"
													onClick={() => {
														setpageno(e);
														setPDFvisible(true);
													}}
													model={items}
													severity="info"
													text
												/>
											</>
										)
									)}
								</span>
							</div>
						</div>
					</Container>

					<Divider align="center">
						<span className="p-tag">Additional Fields to be Viewed/Filled</span>
					</Divider>
					<p>
						<Container hidden={!Supply_Service_bol}>
							<div className="flex flex-wrap gap-1 justify-content-between align-items-center">
								<div className="field">
									<span className="p-float-label">
										<h4>Suply End Date*:</h4>

										<Calendar
											style={{ width: "80%", color: "black" }}
											value={Supply_end_date}
											onChange={(e) => setSupply_end_date(e.value)}
											showIcon
											dateFormat="dd-MM-yy"
										/>
									</span>
								</div>
								<div className="field">
									<span className="p-float-label">
										<h4>Installation End Date*:</h4>

										<Calendar
											inputClassName="cale"
											style={{ width: "80%" }}
											value={Installation_end_date}
											onChange={(e) => setInstallation_end_date(e.value)}
											showIcon
											dateFormat="dd-MM-yy"
										/>
									</span>
								</div>
								<div className="field">
									<span className="p-float-label">
										<h4>TOC Date*:</h4>

										<Calendar
											style={{ width: "80%" }}
											value={Toc_date}
											onChange={(e) => setToc_date(e.value)}
											showIcon
											dateFormat="dd-MM-yy"
										/>
									</span>
								</div>
								<div className="field">
									<span className="p-float-label">
										<h4>
											Maintenance Period {Mp_y_m_d}*{" "}
											<TriStateCheckbox
												// disabled={!Supply_Service_bol}
												value={Mp_tristate_value}
												onChange={(e) => setMp_tristate_value(e.value)}
												// className="p-invalid"
											/>
										</h4>

										<InputNumber
											// disabled={!Supply_Service_bol}
											value={Maintenance_period}
											onChange={(e) => {
												setMaintenance_period(e.value);
											}}
											suffix={Mp_y_m_d}
										/>
									</span>
								</div>
								<div className="field">
									<span className="p-float-label">
										<h4>SD/BG Opted</h4>

										<Dropdown
											placeholder="Contract Platform"
											required
											size={"large"}
											value={SD_BG_opted}
											onChange={(e) => setSD_BG_opted(e.value)}
											options={SD_BG_options}
											optionLabel="name"
											className="w-full md:w-14rem"
										/>
									</span>
								</div>
							</div>
						</Container>

						<Container hidden={!Subscription_bol}>
							<div className="flex flex-wrap gap-1 justify-content-between align-items-center">
								<div className="field">
									<span className="p-float-label">
										<h4>Subscription Start Date:</h4>

										<Calendar
											style={{ width: "80%" }}
											value={Subscription_start_date}
											onChange={(e) => setSubscription_start_date(e.value)}
											showIcon
											dateFormat="dd-MM-yy"
										/>
									</span>
								</div>
								<div className="field">
									<span className="p-float-label">
										<h4>Subscription End Date:</h4>

										<Calendar
											style={{ width: "80%" }}
											value={Subscription_end_date}
											onChange={(e) => setSubscription_end_date(e.value)}
											showIcon
											dateFormat="dd-MM-yy"
										/>
									</span>
								</div>
								<div className="field">
									<span className="p-float-label">
										<h4>SD/BG Opted</h4>

										<Dropdown
											placeholder="Contract Platform"
											required
											size={"large"}
											value={SD_BG_opted}
											onChange={(e) => setSD_BG_opted(e.value)}
											options={SD_BG_options}
											optionLabel="name"
											className="w-full md:w-14rem"
										/>
									</span>
								</div>
							</div>
						</Container>

						<Container hidden={!Service_bol}>
							<div className="flex flex-wrap gap-1 justify-content-between align-items-center">
								<div className="field">
									<span className="p-float-label">
										<h4>Service Start Date:</h4>

										<Calendar
											headerClassName="p-head"
											style={{ width: "80%" }}
											value={Service_start_date}
											onChange={(e) => setService_start_date(e.value)}
											showIcon
											dateFormat="dd-MM-yy"
										/>
									</span>
								</div>
								<div className="field">
									<span className="p-float-label">
										<h4>
											Service Period {SP_y_m_d}{" "}
											<TriStateCheckbox
												// disabled={!AdminChecked}
												value={SP_tristate_value}
												onChange={(e) => setSP_tristate_value(e.value)}
												// className="p-invalid"
											/>
										</h4>

										<InputNumber
											// disabled={!AdminChecked}
											placeholder="Service Period"
											value={Service_period}
											onChange={(e) => {
												setService_period(e.value);
											}}
											suffix={SP_y_m_d}
										/>
									</span>
								</div>
							</div>
						</Container>

						<Container hidden={!Supply_bol}>
							<div className="flex flex-wrap gap-1 justify-content-between align-items-center">
								<div className="field">
									<span className="p-float-label">
										<h4>Service End Date:</h4>

										<Calendar
											style={{ width: "80%" }}
											value={Supply_end_date}
											onChange={(e) => setSupply_end_date(e.value)}
											showIcon
											dateFormat="dd-MM-yy"
										/>
									</span>
								</div>
								<div className="field">
									<span className="p-float-label">
										<h4>
											Warranty Period {Wr_y_m_d}{" "}
											<TriStateCheckbox
												// disabled={!AdminChecked}
												value={Wr_tristate_value}
												onChange={(e) => setWr_tristate_value(e.value)}
												// className="p-invalid"
											/>
										</h4>

										<InputNumber
											// disabled={!AdminChecked}
											placeholder="Contract Period"
											value={Warranty_period}
											onChange={(e) => {
												setWarranty_period(e.value);
											}}
											suffix={Wr_y_m_d}
										/>
									</span>
								</div>
							</div>
						</Container>

						<Container hidden={!SD_BG_opted["code"]}>
							<div className="flex flex-wrap gap-1 justify-content-between align-items-center">
								<div className="field">
									<span className="p-float-label" style={{ width: "100%" }}>
										<h4>Upload SD/BG</h4>

										<FileUpload
											// ref={fu}
											chooseLabel={"Select Files"}
											cancelLabel={"Clear All"}
											previewWidth={300}
											name="demo[]"
											onUpload={Sd_Bg_file}
											url="http://10.3.200.63:5011/upload"
											accept="pdf/*"
											maxFileSize={50000000}
											// multiple
											emptyTemplate={
												<p className="m-0">
													Drag and drop relevant SD/BG file.
												</p>
											}
										/>
									</span>
								</div>
								<div className="field">
									<span className="p-float-label">
										<h4>SD/BG Amount:</h4>

										<InputNumber
											placeholder="Contract Value in ₹"
											value={SD_BG_amount}
											onChange={(e) => setSD_BG_amount(e.value)}
											prefix="₹ "
										/>
									</span>
								</div>
								<div className="field">
									<span className="p-float-label">
										<h4>BG Expiry Date*:</h4>

										<Calendar
											style={{ width: "80%" }}
											value={BG_expiry_date}
											onChange={(e) => setBG_expiry_date(e.value)}
											showIcon
											dateFormat="dd-MM-yy"
										/>
									</span>
								</div>
							</div>
						</Container>
					</p>
				</Dialog>
			</div>
		</>
	);
}
export default Contracts;