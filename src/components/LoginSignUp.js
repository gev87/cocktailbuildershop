import React, { useContext, useRef, useState } from 'react';
import { withStyles,Button,Menu,MenuItem } from '@material-ui/core';
import { ListItemIcon, ListItemText, TextField } from "@material-ui/core";
import LockIcon from '@material-ui/icons/Lock';
import InputIcon from '@material-ui/icons/Input';
import { Dialog, Avatar,CssBaseline,Link, Grid } from "@material-ui/core";
import { Box, Typography, makeStyles, Container } from "@material-ui/core";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { MainContext } from "../context/MainContext";
import { Alert } from "@material-ui/lab";
import Footer from './Footer';

const StyledMenu = withStyles({
	paper: {
		border: '1px solid #d3d4d5',
	},
})((props) => (
	<Menu
		elevation={0}
		getContentAnchorEl={null}
		anchorOrigin={{
			vertical: 'bottom',
			horizontal: 'center',
		}}
		transformOrigin={{
			vertical: 'top',
			horizontal: 'center',
		}}
		{...props}
	/>
));

const StyledMenuItem = withStyles((theme) => ({
	root: {
		'&:focus': {
			backgroundColor: theme.palette.primary.main,
		},
		// padding: 0,
	},
}))(MenuItem);


const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));



export default function LoginSignUp() {
	const [anchorEl, setAnchorEl] = useState(null);
	const [openLD, setOpenLD] = useState(false);
	const [openSD, setOpenSD] = useState(false);
	const classes = useStyles();
	const { login, signup } = useContext(MainContext);
	const emailRef = useRef();
	const [error, setError] = useState("");
	const [, setLoading] = useState(true);
	const passwordRef = useRef();
	const passwordConfirmRef = useRef();
	const nameRef = useRef();




	async function handleSubmit(e) {
		e.preventDefault();
		try {
			setError("");
			 await login(emailRef.current.value,passwordRef.current.value);
			// navigate("/");
		} catch {
			setError("Failed to sign in");
		return
		}
		setOpenLD(false);
	}
	async function handleSubmitSignUp(e) {
	setLoading(false);
		e.preventDefault();
		if (passwordRef.current.value !== passwordConfirmRef.current.value) {
			return setError("Passwords do NOT match");
		}
		if (passwordRef.current.value.length < 6) {
			return setError("Password must have at least 6 characters");
		}

		if (!emailRef.current.value.includes("@" || ".")) {
			return setError("Invalid Email Format");
		}
		try {
			setError("");
			setLoading(true);
			await signup(
				emailRef.current.value,
				passwordRef.current.value,
				nameRef.current.value
			).catch(() => {});;
			// navigate("/");
		} catch {
		
			setError("Failed to create an account");
		
			return
		}
			setOpenSD(false);
		setLoading(false);
	}

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose1 = () => {
		setAnchorEl(null);
	};
	const LoginDialog = () => {
		const handleClose = () => {
			setAnchorEl(null);
			setOpenLD(false);
		};
		return (
			<div>
				<Dialog
					open={openLD}
					onClose={handleClose}
					aria-labelledby="form-dialog-title"
					onSubmit={handleSubmit}
				>
					<Container component="main" maxWidth="xs">
						<CssBaseline />
						<div className={classes.paper}>
							<Avatar className={classes.avatar}>
								<LockOutlinedIcon />
							</Avatar>
							<Typography component="h1" variant="h5">
								Login
							</Typography>
							{error && (
								<div className={classes.root}>
									<Alert variant="filled" severity="error">
										{error}
									</Alert>
								</div>
							)}
							<form className={classes.form} noValidate>
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
									type="password"
									id="password"
									autoComplete="current-password"
								/>
								<Button
									type="submit"
									fullWidth
									variant="contained"
									color="primary"
									className={classes.submit}
								>
									Login
								</Button>
								<Grid container>
									<Grid item xs></Grid>
									<Grid item></Grid>
									<Grid item>
										<Link
											variant="body2"
											onClick={handleClose}
											style={{ cursor: "pointer" }}
										>
											{"Cancel"}
										</Link>
									</Grid>
								</Grid>
							</form>
						</div>
						<Box mt={8}>
							<Footer />
						</Box>
					</Container>
				</Dialog>
			</div>
		);

	}
	const SignUpDialog = () => {

		const handleClose = () => {
			setOpenSD(false)
		};

		return (
			<div>
				<Dialog
					open={openSD}
					onClose={handleClose}
					aria-labelledby="form-dialog-title"
					onSubmit={handleSubmitSignUp}
				>
					<Container component="main" maxWidth="xs">
						<CssBaseline />
						<div className={classes.paper}>
							<Avatar className={classes.avatar}>
								<LockOutlinedIcon />
							</Avatar>
							<Typography component="h1" variant="h5">
								Sign up
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
										/>
									</Grid>
									<Grid item xs={12}>
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
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											inputRef={passwordRef}
											variant="outlined"
											required
											fullWidth
											name="password"
											label="Password"
											type="password"
											id="password"
											autoComplete="current-password"
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											inputRef={passwordConfirmRef}
											variant="outlined"
											required
											fullWidth
											name="password"
											label="Password Confirmation"
											type="password"
											id="password-confirm"
											autoComplete="current-password"
										/>
									</Grid>
								</Grid>
								<Button
									type="submit"
									fullWidth
									variant="contained"
									color="primary"
									className={classes.submit}
								>
									Sign Up
								</Button>
								<Grid container justifyContent="flex-end">
									<Grid item>
										<Link
											variant="body2"
											onClick={handleClose}
											style={{ cursor: "pointer" }}
										>
											{"Cancel"}
										</Link>
									</Grid>
								</Grid>
							</form>
						</div>
						<Box mt={5}>
							<Footer />
						</Box>
					</Container>
				</Dialog>
			</div>
		);
	}

	return (
		<div>
			<Button
				//   aria-controls="customized-menu"
				//   aria-haspopup="true"
				// variant="contained"
				color="primary"
				variant="outlined"
				size="small"
				onClick={handleClick}
			>
				Order Now
			</Button>
			<StyledMenu
				id="customized-menu"
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={handleClose1}
			>
				<StyledMenuItem onClick={() => { setOpenLD(true); handleClose1() }}>
					<ListItemIcon>
						<InputIcon fontSize="small" />
					</ListItemIcon>
					<ListItemText primary="Login" />
				</StyledMenuItem>
				<StyledMenuItem onClick={() => { setOpenSD(true); handleClose1() }}>
					<ListItemIcon>
						<LockIcon fontSize="small" />
					</ListItemIcon>
					<ListItemText primary="SignUp" />
				</StyledMenuItem>
			</StyledMenu>
			<LoginDialog />
			<SignUpDialog />
		</div>
	);
}