import React, { useEffect, useState, useRef } from "react";
import { Calendar } from "primereact/calendar";
import "../cssFiles/PasswordDemo.css";
import "primeflex/primeflex.css";
import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import "../cssFiles/ButtonDemo.css";

import axios from "axios";

import { Button } from "primereact/button";
import { DownloadTableExcel } from "react-export-table-to-excel";
import { Fieldset } from "primereact/fieldset";
import { Divider } from "primereact/divider";
import { MultiSelect } from "primereact/multiselect";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

function Assets() {
	const [Asset_Category, setAsset_Category] = useState([]);
	const [Category, setCategory] = useState();
	const [Assets, setAssets] = useState(null);
	const [Headers, setHeaders] = useState([]);
	const [ShowDataTable, setShowDataTable] = useState(false);
	const tableRef = useRef(null);

	useEffect(() => {
		axios
			.post(
				"http://10.3.200.63:5011/IT_Data_assets?category=yes",

				{}
			)
			.then((response) => {
				setCategory(response.data);
			});
	}, []);

	const ShowDtata = () => {
		let temp_Assets = {};
		let temp_headers = [];
		axios
			.post(
				"http://10.3.200.63:5011/IT_Data_assets?category=no",

				{}
			)
			.then((response) => {
				for (var k = 0; k < Asset_Category.length; k++) {
					var temp_list = [];
					for (var i = 0; i < response.data.length; i++) {
						if (response.data[i]["Category"] === Asset_Category[k]) {
							temp_list.push(response.data[i]);
						}
					}
					if (temp_list.length) {
						temp_Assets[Asset_Category[k]] = temp_list;
						temp_headers.push(Object.keys(temp_list[0]));
					}
				}
				setAssets(temp_Assets);

				setHeaders(temp_headers);
			});
		setShowDataTable(true);
	};

	return (
		<>
			<br />
			<br />
			<Fieldset
				legend={
					<div className="flex align-items-center text-primary">
						<span className="font-bold text-lg">IT Assets</span>
					</div>
				}
			>
				<h3>Selecy Asset Category</h3>
				<MultiSelect
					filterPlaceholder="Search BUS here"
					showSelectAll
					selectAll
					showClear
					resetFilterOnHide
					display="chip"
					placeholder="Select Assets"
					value={Asset_Category}
					options={Category}
					onChange={(e) => setAsset_Category(e.value)}
					filter
				/>
				<div
					className="card flex justify-content-center"
					style={{ marginRight: "10%" }}
				>
					<span className="p-float-label">
						<Button
							style={{
								marginLeft: "20%",
								width: "auto",
								float: "center",
							}}
							label="Get IT Assets Data"
							aria-label="IT Cotracts Data"
							onClick={() => {
								ShowDtata();
							}}
						/>
					</span>
				</div>
				<Divider></Divider>
				{Headers.length >= Asset_Category.length &&
				Assets &&
				Headers &&
				ShowDataTable ? (
					<>
						{" "}
						{Asset_Category.map((cat, index) => {
							return (
								<>
									<DownloadTableExcel
										filename="Assets Data"
										sheet="users"
										currentTableRef={tableRef.current}
									>
										<Button className="p-button-success"> Export excel </Button>
									</DownloadTableExcel>
									<div ref={tableRef}>
										<div className="card flex justify-content-center">
											<span className="p-float-label">
												<h3>{cat} Data</h3>
											</span>
										</div>
										<br />
										<div className="card flex justify-content-center">
											<span className="p-float-label">
												<DataTable
													showGridlines
													scrollable
													reorderableColumns
													resizableColumns
													value={Assets[cat]}
													responsiveLayout="scroll"
												>
													{Headers[index].map((item, index) => (
														<Column
															sortable
															filter
															field={item}
															header={item}
															tableStyle={{ minWidth: "10rem" }}
														></Column>
													))}
												</DataTable>
											</span>
										</div>
									</div>
									<Divider></Divider>
								</>
							);
						})}{" "}
					</>
				) : (
					<></>
				)}
			</Fieldset>
		</>
	);
}

export default Assets;
