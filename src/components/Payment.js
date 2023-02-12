import React, { useEffect, useContext } from "react";
import NavBar from "./NavBar";
import Cards from "react-credit-cards";
import { useState } from "react";
import "react-credit-cards/es/styles-compiled.css";
import THEMES from "../consts/THEMES";
import { Button, Container, TextField, Typography } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { MainContext } from "../context/MainContext";
import { readOnceGet,removeAsync } from "../firebase/crudoperations";
import { Navigate } from "react-router-dom";

export default function Payment() {
	const [number, setNumber] = useState("");
	const [name, setName] = useState("");
	const [cvc, setCvc] = useState("");
	const [expiry, setExpiry] = useState("");
	const [focus, setFocus] = useState("");
	const classes = THEMES();
	const [showAlert, setShowAlert] = useState(false);
	const { currentUser } = useContext(MainContext);
	const [cart,setCart] = useState({});
	const [, setClearCart] = useState(false);
	const [showErrorAlert,setErrorAlert] = useState(false);
	
	useEffect(() => {
		currentUser &&
			readOnceGet(`users/${currentUser.uid}/orders`, (items) => items).then(
				(value) => {
					setCart(value ? value : {});
				}
			);
	},[currentUser]);
	
	const clearAll = (currentUser) => {
		if (name.length < 3 || number.length < 16 || cvc.length < 3 || expiry.length<4) {
			setErrorAlert(true);
			return;
		}
		removeAsync(`users/${currentUser.uid}/orders`);
		setClearCart(true);
		setErrorAlert(false);
		setShowAlert(true);
		setCart([])
	};

	return (!currentUser ? <Navigate to="/" /> :
		(<>
			<NavBar
				cartQty={Object.values(cart).reduce(
					(cur, elem) => cur + elem.quantity,
					0
				)}
				showDrawer={false}
			/>
			
			
				<div
					className={classes.heroContent}
					style={{ color: "#171818", paddingTop: "10px" }}
				>
					<Container maxWidth="sm">
						<Typography
							component="h2"
							variant="h2"
							align="center"
							color="textPrimary"
							gutterBottom
						>
							Payment
						</Typography>
						<Typography
							variant="h5"
							align="center"
							color="textSecondary"
							paragraph
						>
							{" "}
							After buying our cocktails, you will get an annual free trip around
							the sun
						</Typography>
						<div style={{ paddingBottom: "10px" }} id="PaymentForm">
							{showAlert && <Alert>Success</Alert>}
							{showErrorAlert && (
								<Alert severity="error">
									Check all the fields and try again
								</Alert>
							)}
							<Cards
								cvc={cvc}
								expiry={expiry}
								focused={focus}
								name={name}
								number={number}
							/>
						</div>
						<div style={{ display: "flex", padding: "10px" }}>
							<TextField
								variant="outlined"
								type="tel"
								name="number"
								placeholder="Card Number"
								value={number}
								onChange={(e) =>
									setNumber(
										e.target.value.length < 17
											? e.target.value
											: e.target.value.slice(0, 15)
									)
								}
								onFocus={(e) => setFocus(e.target.name)}
								fullWidth
							/>

							<TextField
								variant="outlined"
								fullWidth
								type="text"
								name="name"
								placeholder="Name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								onFocus={(e) => setFocus(e.target.name)}
							/>
						</div>
						<div style={{ display: "flex", padding: "10px" }}>
							<TextField
								variant="outlined"
								fullWidth
								type="text"
								name="expiry"
								placeholder="MM/YY Expiry"
								value={expiry}
								onChange={(e) =>
									setExpiry(
										e.target.value.length < 6
											? e.target.value
											: e.target.value.slice(0, 3)
									)
								}
								onFocus={(e) => setFocus(e.target.name)}
							/>
							<TextField
								variant="outlined"
								fullWidth
								type="tel"
								name="cvc"
								placeholder="CVC"
								value={cvc}
								onChange={(e) =>
									setCvc(
										e.target.value.length < 4
											? e.target.value
											: e.target.value.slice(0, 2)
									)
								}
								onFocus={(e) => setFocus(e.target.name)}
							/>
						</div>
						<Button
							onClick={() => clearAll(currentUser)}
							fullWidth
							variant="contained"
							color="primary"
						>
							Pay Now
						</Button>
					</Container>
				</div>
			
		
		</>)
	);
}
