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
// import { FileUpload } from "primereact/fileupload";
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
// Define a function component to upload a file
function FileUploads() {
	// Define a state variable to store the file
	const [file, setFile] = useState(null);

	// Define a function to handle the file change event
	const handleFileChange = (e) => {
		// Get the selected file from the event
		const selectedFile = e.target.files[0];
		// Set the file state to the selected file
		setFile(selectedFile);
	};

	// Define a function to handle the file upload event
	const handleFileUpload = async (e) => {
		// Prevent the default behavior of the event
		e.preventDefault();
		// Check if the file is selected
		if (file) {
			// Create a form data object to append the file
			const formData = new FormData();
			formData.append("file", file);
			// Send a post request to the api endpoint with the form data
			try {
				const response = await axios.post(
					"http://10.3.200.63:4040/api/upload",
					formData
				);
				// Display the response data
				alert(response.data);
			} catch (error) {
				// Display the error message
				alert(error.message);
			}
		} else {
			// Display a message to select a file
			alert("Please select a file");
		}
	};

	// Return the JSX element to render the file upload form
	return (
		<div className="file-upload">
			<h1>File Upload</h1>
			<form onSubmit={handleFileUpload}>
				<input type="file" onChange={handleFileChange} />
				<button type="submit">Upload</button>
			</form>
		</div>
	);
}

// Export the component
export default FileUploads;
