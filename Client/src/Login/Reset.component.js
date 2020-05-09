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
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { useHistory } from "react-router-dom";
import api from "../utils/config";
import Notif from "../utils/Notification.component";
import PasswordStrengthBar from "react-password-strength-bar";

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

function Reset(props) {
  const classes = useStyles();
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [passwordScore, setPasswordScore] = useState(0);
  const [notifMessage, setNotifMessage] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifSeverity, setNotifSeverity] = useState("success");

  let history = useHistory();
  const sendNotif = function(message, severity) {
    setNotifSeverity(severity);
    setNotifMessage(message);
    setNotifOpen(true);
  };

  function resetPass() {
    if (password !== cpassword) {
      sendNotif("Passwords don't match", "error");
      return;
    } else if (passwordScore < 2) {
      sendNotif("Please choose a stronger Password", "error");
      return;
    }

    Axios.post(api.reset(props), { password: password });
    history.push("/login",{notif:"Email with reset link sent"});
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="oldpassword"
            label="Old Password"
            name="oldpassword"
            hidden={!props.loggedIn}
            value={password}
            onChange={e => {
              setPassword(e.target.value);
            }}
            autoComplete="email"
            autoComplete="current-password"
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={e => {
              setPassword(e.target.value);
            }}
            autoComplete="email"
            autoComplete="new-password"
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="cpassword"
            value={cpassword}
            onChange={e => {
              setCpassword(e.target.value);
            }}
            label="Confirm Password"
            type="password"
            id="cpassword"
            autoComplete="new-password"
          />
          {password.length > 0 ? (
            <PasswordStrengthBar
              password={password}
              onChangeScore={score => {
                setPasswordScore(score);
              }}
            />
          ) : (
            <p />
          )}

          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            className={classes.submit}
            onClick={resetPass}
          >
            Reset
          </Button>
          <Grid container>
            <Grid item xs></Grid>
            <Grid item></Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
      <Notif
        message={notifMessage}
        open={notifOpen}
        handle={setNotifOpen}
        severity={notifSeverity}
      />
    </Container>
  );
}

export default function ResetPage(props) {
  const data = props.match.params;
  const ident = data.ident;
  const today = data.today;
  const hash = data.hash;
  let [status, setStatus] = useState(false);
  useEffect(() => {
    Axios.post(api.resetVerify(props.match.params)).then(res => {
      setStatus(res.status);
    });
  });

  if (status === 200) {
    return <Reset ident={ident} today={today} hash={hash} />;
  } else {
    return <h1>{status}</h1>;
  }
}
