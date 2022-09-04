import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainContext } from "../context/MainContext";
import { Button, CssBaseline, Avatar, TextField } from "@material-ui/core";
import { FormControlLabel, Link, Grid, Box } from "@material-ui/core";
import { Typography, Container, Checkbox } from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Alert from "@material-ui/lab/Alert";
import Footer from "./Footer";
import THEMES from "../consts/THEMES";



export default function UpdateProfile() {
	const classes = THEMES();
	const emailRef = useRef();
	const passwordRef = useRef();
	const passwordConfirmRef = useRef();
	const { currentUser, updatePassword, updateEmail, updateName } =
		useContext(MainContext);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const nameRef = useRef();
	const [show, setShow] = useState("password");

	function handleSubmit(e) {
		e.preventDefault();
		if (passwordRef.current.value !== passwordConfirmRef.current.value) {
			return setError("Passwords do NOT match");
		}
		if (
			passwordRef.current.value.length < 6 &&
			passwordRef.current.value.length > 0
		) {
			return setError("Weak password");
		}

		const promises = [];
		setLoading(true);
		setError("");
			

		if (passwordRef.current.value && emailRef.current.value !== currentUser?.email) {
				promises.push(updatePassword(passwordRef.current.value));

		}
		if (emailRef.current.value !== currentUser?.email) {
			promises.push(updateEmail(emailRef.current.value));
		}
			if (nameRef.current.value !== currentUser.displayName) {
				promises.push(updateName(nameRef.current.value));
			}
		Promise.all(promises)
			.then(() => {
				navigate("/");
			})
			.catch(() => {
				setError("Failed to update account");
			})
			.finally(() => {
				setLoading(false);
			});
	}

	return (
		<Container onSubmit={handleSubmit} component="main" maxWidth="xs">
			<CssBaseline />
			<div className={classes.paper}>
				<Avatar className={classes.avatarblue}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Update Profile
				</Typography>
				{error && (
					<div className={classes.root}>
						<Alert variant="filled" severity="error">
							{error}
						</Alert>
					</div>
				)}
				<form className={classes.form} noValidate>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								inputRef={nameRef}
								autoComplete="fname"
								name="Name"
								variant="outlined"
								required
								fullWidth
								id="Name"
								label="Username"
								autoFocus
								defaultValue={currentUser?.displayName}
							/>
						</Grid>
						<Grid id="email" item xs={12}>
							<TextField
								type="email"
								inputRef={emailRef}
								variant="outlined"
								required
								fullWidth
								id="email"
								label="Email Address"
								name="email"
								autoComplete="email"
								defaultValue={currentUser?.email}
							/>
						</Grid>
						<Grid id="password" item xs={12}>
							<TextField
								inputRef={passwordRef}
								variant="outlined"
								fullWidth
								name="password"
								label="Password"
								type={show}
								id="password"
								autoComplete="current-password"
							/>
							/leave blank to keep the same/
						</Grid>
						<Grid item xs={12}>
							<Grid id="password" item xs={12}>
								<TextField
									inputRef={passwordConfirmRef}
									variant="outlined"
									fullWidth
									name="password"
									label="Password Confirmation"
									type={show}
									id="password-confirm"
									autoComplete="current-password"
								/>{" "}
								/leave blank to keep the same/
							</Grid>
							<FormControlLabel
								control={
									<Checkbox
										onClick={() =>
											setShow(show === "password" ? "text" : "password")
										}
										value="allowExtraEmails"
										color="primary"
									/>
								}
								label="Show Passwords"
							/>
						</Grid>
					</Grid>
					<Button
						disabled={loading}
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
					>
						Update
					</Button>

					<Grid container justifyContent="flex-end">
						<Grid item>
							<Link href="/" variant="body2" style={{ paddingRight: "185px" }}>
								Cancel
							</Link>
						</Grid>
					</Grid>
				</form>
			</div>
			<Box mt={5}>
				<Footer />
			</Box>
		</Container>
	);
}

/*
function UpdateProfile() {
	const emailRef = useRef();
	const passwordRef = useRef();
	const passwordConfirmRef = useRef();
	const { currentUser, updatePassword, updateEmail, updateName } =
		useContext(MainContext);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const nameRef = useRef();

	function handleSubmit(e) {
		e.preventDefault();
		if (passwordRef.current.value !== passwordConfirmRef.current.value) {
			return setError("Passwords do NOT match");
		}
		if (
			passwordRef.current.value.length < 6 &&
			passwordRef.current.value.length > 0
		) {
			return setError("Weak password");
		}

		const promises = [];
		setLoading(true);
		setError("");

		if (emailRef.current.value !== currentUser?.email) {
			promises.push(updateEmail(emailRef.current.value));
		}

		if (passwordRef.current.value) {
			promises.push(updatePassword(passwordRef.current.value));
		}
		if (nameRef.current.value !== currentUser?.displayName) {
			promises.push(updateName(nameRef.current.value));
		}

		Promise.all(promises)
			.then(() => {
				navigate("/");
			})
			.catch(() => {
				setError("Failed to update account");
			})
			.finally(() => {
				setLoading(false);
			});
	}

	return (
		<>
			<Card>
				<Card.Body>
					<h2 className="text-center mb-4">Update Profile</h2>
					{error && <Alert variant="danger">{error}</Alert>}
					<Form onSubmit={handleSubmit}>
						<Form.Group id="name">
							<Form.Label>Name</Form.Label>
							<Form.Control
							
								type="text"
								ref={nameRef}
								required
								defaultValue={currentUser?.displayName}
							/>
						</Form.Group>
						<Form.Group id="email">
							<Form.Label>Email</Form.Label>
							<Form.Control
								type="email"
								ref={emailRef}
								required
								defaultValue={currentUser?.email}
							/>
						</Form.Group>
						<Form.Group id="password">
							<Form.Label>Password</Form.Label>
							<Form.Control
								type="password"
								ref={passwordRef}
								placeholder="Leave blank to keep the same"
							/>
						</Form.Group>
						<Form.Group id="password-confirm">
							<Form.Label>Password Confirmation</Form.Label>
							<Form.Control
								type="password"
								ref={passwordConfirmRef}
								placeholder="Leave blank to keep the same"
							/>
						</Form.Group>
						<br />
						<Button disabled={loading} className="w-100" type="submit">
							Update
						</Button>
					</Form>
				</Card.Body>
			</Card>
			<div className="w-100 text-center mt-25">
				<Link to="/"> Cancel</Link>
			</div>
		</>
	);
}

export default UpdateProfile;*/
