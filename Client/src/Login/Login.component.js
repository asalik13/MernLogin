import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Alert from "@material-ui/lab/Alert";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Notif from "../utils/Notification.component";
import api from "../utils/config";

import { useHistory } from "react-router-dom";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="http://ayushsalik.com">
        ayushsalik.com
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function LogIn(props) {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [incorrectNotif, setIncorrectNotif] = useState(false);
  const [passErrorNotif, setPassErrorNotif] = useState(false);
  const [emailErrorNotif, setEmailErrorNotif] = useState(false);
  const [emailHelperText, setEmailHelperText] = useState("");
  const [notifMessage, setNotifMessage] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifSeverity, setNotifSeverity] = useState("success");
  const [emailHelper, setEmailHelper] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [loading, setLoading] = useState(false);
  let history = useHistory();

  useEffect(() => {
    let state = props.history.location.state;
    if (state !== undefined && state.notif !== undefined) {
      sendNotif(state.notif, "success");
    }
  }, []);

  const sendNotif = function(message, severity) {
    setNotifSeverity(severity);
    setNotifMessage(message);
    setNotifOpen(true);
  };

  const logIn = function(e) {
    e.preventDefault();
    setLoading(true);

    Axios.post(api.login, {
      user: { email: email, password: password }
    })
      .then(res => {
        setLoading(false);
        if (res.data.error) {
          sendNotif(res.data.error, "error");
          return;
        }

        if (res.status === 200) {
          setIncorrectNotif(false);
          setPassErrorNotif(false);
          history.push("/secret");
        }
      })
      .catch(err => {
        setLoading(false);

        sendNotif("Email or password is incorrect. Please try again", "error");
      });
  };
  if (loading) {
    return <h6>loading...</h6>;
  } else {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <br />
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              error={emailErrorNotif}
              helperText={emailHelperText}
              id="email"
              label="Email Address"
              name="email"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
              }}
              autoComplete="email"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              error={passErrorNotif}
              helperText={
                passErrorNotif
                  ? "Email or password is incorrect. Please try again"
                  : ""
              }
              name="password"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                setPassErrorNotif(false);
              }}
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />

            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              onClick={logIn}
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/forgot" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
          <Notif
            message={notifMessage}
            open={notifOpen}
            handle={setNotifOpen}
            severity={notifSeverity}
          />
        </Box>
      </Container>
    );
  }
}
