import { useState } from "react";
import { Avatar } from "primereact/avatar";
import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import "./App.css";
import "primeicons/primeicons.css";

import Dashboard from "./Components/Dashboard";
import Input from "./Components/input";
import Contracts from "./Components/Contracts";
import Assets from "./Components/Assets";

function App() {
	const [Token, setToken] = useState("");
	const [Dashshow, setDashshow] = useState(true);
	const [InputShow, setInputShow] = useState(true);
	const [ContShow, setContShow] = useState(true);
	// const [Assetsshow, setAssetsshow] = useState(true);

	return (
		<div className="routes">
			<div className="shadow-class" style={{ marginTop: ".2%", marginBottom: "2%" }}><img src="GI-Nav.jpg" alt="posoco" style={{ width: "100%" }} /></div>
			
			<Router>
				<div
					className="list"
					style={{ fontSize: "x-small", marginTop: "1%", marginBottom: "-1%" }}
				>
					{/* <ul hidden={Dashshow && InputShow && ContShow && Assetsshow}> */}
					<ul hidden={Dashshow && InputShow && ContShow}>
						<Link to={"/?token=" + Token}>
							<Avatar
								icon="pi pi-building"
								style={{ backgroundColor: "#16a34a", color: "#ffffff" }}
								shape="circle"
							/>
							Dashboard
						</Link>

						<Link to={"Input?token=" + Token}>
							<Avatar
								icon="pi pi-user-edit"
								style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
								shape="circle"
							/>
							Contracts Input
						</Link>

						<Link to={"Contracts?token=" + Token}>
							<span style={{ fontSize: "25px" }}></span>
							<Avatar
								icon="pi pi-copy"
								style={{ backgroundColor: "#efff12", color: "#000000" }}
								shape="circle"
							/>
							Contracts Data
						</Link>

						<a href={"https://sso.erldc.in:3000"}>
							<Avatar
								icon="pi pi-sign-out"
								style={{ backgroundColor: "#ff3e1f", color: "#ffffff" }}
								shape="circle"
							/>
							Logout
						</a>
					</ul>
				</div>
				<Routes>
					<Route
						exact
						path="/"
						element={<Dashboard var1={setDashshow} var2={setToken} />}
					/>
					<Route exact path="Input" element={<Input var3={setInputShow} />} />
					<Route
						exact
						path="Contracts"
						element={<Contracts var4={setContShow} />}
					/>
					{/* <Route
						exact
						path="Assets"
						element={<Assets var5={setAssetsshow} />}
					/> */}
				</Routes>
			</Router>
		</div>
	);
}
export default App;
