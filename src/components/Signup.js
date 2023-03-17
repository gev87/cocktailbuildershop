import React, { useContext, useRef, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { MainContext } from "../context/MainContext";
import { Button, CssBaseline, Avatar, TextField } from "@material-ui/core";
import { FormControlLabel, Link, Grid, Box } from "@material-ui/core";
import { Typography, Container, Checkbox } from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Alert from "@material-ui/lab/Alert";
import Footer from "./Footer";
import THEMES from "../consts/THEMES";

export default function Signup() {
  const classes = THEMES();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup, currentUser } = useContext(MainContext);
  const [error, setError] = useState("");
  const [show, setShow] = useState("password");
  const navigate = useNavigate();
  const nameRef = useRef();

  async function handleSubmit(e) {
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
      await signup(
        emailRef.current.value,
        passwordRef.current.value,
        nameRef.current.value
      );
      navigate("/");
    } catch (e) {
      setError("Failed to create an account");
    }
  }

  return currentUser ? (
    <Navigate to="/" />
  ) : (
    <Container onSubmit={handleSubmit} component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatarred}>
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
                type={show}
                id="password"
                autoComplete="current-password"
              />
            </Grid>
            <Grid item xs={12}>
              <Grid item xs={12}>
                <TextField
                  inputRef={passwordConfirmRef}
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password Confirmation"
                  type={show}
                  id="password-confirm"
                  autoComplete="current-password"
                />
              </Grid>
              <FormControlLabel
                control={
                  <Checkbox
                    onClick={() =>
                      setShow(show === "password" ? "text" : "password")
                    }
                    color="primary"
                  />
                }
                label="Show passwords"
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
                href="/login"
                variant="body2"
                style={{ paddingRight: "100px" }}
              >
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
          <div style={{ paddingLeft: "185px" }}>or</div>
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
