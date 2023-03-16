import React, { useContext, useRef, useState } from "react";
import { MainContext } from "../context/MainContext";
import { useNavigate, Navigate } from "react-router-dom";
import { TextField, FormControlLabel, Checkbox } from "@material-ui/core";
import { Avatar, Button, CssBaseline } from "@material-ui/core";
import { Link, Paper, Box, Grid, Typography } from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { Alert } from "@material-ui/lab";
import Footer from "./Footer";
import THEMES from "../consts/THEMES";

export default function Login() {
	const classes = THEMES();
	const emailRef = useRef();
	const passwordRef = useRef();
	const { login, currentUser } = useContext(MainContext);
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const [show, setShow] = useState("password");

	async function handleSubmit(e) {
		e.preventDefault();
		try {
			setError("");
			await login(emailRef.current.value, passwordRef.current.value);
			navigate("/");
		} catch {
			setError("Failed to sign in");
		}
	}

	return currentUser ? (
		<Navigate to="/" />
	) : (
		<Grid container onSubmit={handleSubmit} component="main" className={classes.rootlog}>
			<CssBaseline />
			<Grid item xs={false} sm={4} md={7} className={classes.image} />
			<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
				<div className={classes.paper1}>
					<Avatar className={classes.avatarred}>
						<LockOutlinedIcon />
					</Avatar>

					<Typography component="h1" variant="h5">
						Log in
					</Typography>
					{error && (
						<div className={classes.root}>
							<Alert variant="filled" severity="error">
								{error}
							</Alert>
						</div>
					)}
					<form className={classes.form1} noValidate>
						<TextField
							inputRef={emailRef}
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							autoFocus
						/>
						<TextField
							inputRef={passwordRef}
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type={show}
							id="password"
							autoComplete="current-password"
						/>
						<FormControlLabel
							control={
								<Checkbox
									onClick={() => setShow(show === "password" ? "text" : "password")}
									color="primary"
								/>
							}
							label="Show password"
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
						>
							Log In
						</Button>
						<Grid container>
							<Grid item xs>
								<Link href="/forgot-password" variant="body2">
									Forgot password?
								</Link>
							</Grid>
							<Grid item>
								<Link href="/signup" variant="body2" style={{ paddingRight: "140px" }}>
									Don't have an account? Sign Up
								</Link>
							</Grid>
							<Grid item>
								<Link href="/" variant="body2">
									Cancel
								</Link>
							</Grid>
						</Grid>
						<hr />
						<Box mt={5}>
							<Footer />
						</Box>
					</form>
				</div>
			</Grid>
		</Grid>
	);
}
