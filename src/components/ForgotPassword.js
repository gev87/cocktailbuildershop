import React, { useContext, useRef, useState } from "react";
import { MainContext } from "../context/MainContext";
import { Avatar, Button, Link, Paper, Box, Grid } from "@material-ui/core";
import { CssBaseline, TextField, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import Footer from "./Footer";
import THEMES from "../consts/THEMES";


export default function ForgotPassWord() {
	const classes = THEMES();
	const emailRef = useRef();
	const { resetPassword } = useContext(MainContext);
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e) {
		e.preventDefault();
		try {
			setMessage("");
			setError("");
			setLoading(true);
			await resetPassword(emailRef.current.value);
			setMessage("Check your inbox for further instructures");
		} catch {
			setError("Failed to reset password");
		}
		setLoading(false);
	}

	return (
		<Grid container component="main" className={classes.rootlog}>
			<CssBaseline />
			<Grid item xs={false} sm={4} md={7} className={classes.image} />
			<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
				<div className={classes.paper1}>
					<Avatar className={classes.avatarblue}></Avatar>
					<Typography component="h1" variant="h5">
						Password Reset
					</Typography>
					{error && (
						<div className={classes.root}>
							<Alert variant="filled" severity="error">
								{error}
							</Alert>
						</div>
					)}
					{message && (
						<div className={classes.root}>
							<Alert variant="filled" severity="success">
								{message}
							</Alert>
						</div>
					)}
					<form onSubmit={handleSubmit} className={classes.form1} noValidate>
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
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
							disabled={loading}
						>
							Reset Password
						</Button>
						<br />
						<Grid container>
							<Grid item xs>
								<Link href="/login" variant="body2">
									Log In
								</Link>
							</Grid>
							<Grid item style={{ padding: "15px" }}>
								<Link
									href="/signup"
									variant="body2"
									style={{ paddingRight: "140px" }}
								>
									{"Don't have an account? Sign Up"}
								</Link>
							</Grid>
							<Grid item>
								<Link href="/" variant="body2">
									{"Cancel"}
								</Link>
							</Grid>
						</Grid>

						<Box mt={5}>
							<Footer />
						</Box>
					</form>
				</div>
			</Grid>
		</Grid>
	);
}
