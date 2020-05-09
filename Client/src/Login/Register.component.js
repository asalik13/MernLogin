import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import passwordStrength from "zxcvbn";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import api from "../utils/config";
import PasswordStrengthBar from "react-password-strength-bar";
import Notif from "../utils/Notification.component";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
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

export default function Register() {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [emailHelper, setEmailHelper] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [passwordHelperText, setPasswordHelperText] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordScore, setPasswordScore] = useState(0);
  const [notifMessage, setNotifMessage] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifSeverity, setNotifSeverity] = useState("success");


  let history = useHistory();

  const validateEmail = function(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return email === "" || re.test(String(email).toLowerCase());
  };

  const sendNotif = function(message,severity) {
    setNotifSeverity(severity)
    setNotifMessage(message);
    setNotifOpen(true);
  };
  React.useEffect(() => {
    let value = validateEmail(email);
    if (!value) {
      setEmailHelper("Please enter a valid email");
    } else {
      setEmailHelper("");
    }
    setEmailError(!value);
  }, [email]);

  React.useEffect(() => {
    let match = cpassword === "" || cpassword === password;
    if (!match) {
      setPasswordHelperText("Passwords don't match");
      setPasswordsMatch(false);
    } else {
      setPasswordHelperText("");
      setPasswordsMatch(true);
    }
  }, [cpassword, password]);

  const register = function(e) {
    e.preventDefault();
    let fields = [firstName, lastName, email, password];
    let emptyFields = fields.filter(field => field === "");

    if (emptyFields.length > 0) {
      sendNotif("Please fill all the fields","error");
      return;
    }

    if (emailError) {
      sendNotif("Please enter a valid email","error");
      return;
    }
    if (passwordScore < 2) {
      sendNotif("Please enter a stronger password","error");

      return;
    }

    Axios.post(api.register, {
      user: {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName
      }
    }).then(res => {
      if (res.data.email === "Already exists") {
        sendNotif("This email already exists","error");
      }
      else if (res.status === 200) {
        history.push("/login",{notif:"Verification Email Sent"});
      }
      return;
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <form autoComplete="new-password" className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="First Name"
            name="firstName"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            autoComplete="given-name"
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Last Name"
            name="lastName"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            autoComplete="family-name"
          />

          <TextField
            variant="outlined"
            margin="normal"
            required
            error={emailError}
            fullWidth
            label="Email Address"
            name="email"
            helperText={emailHelper}
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
          />

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="new-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            label="Password"
            type="password"
            id="new-password"
            autoComplete="new-password"
          />

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            error={!passwordsMatch}
            name="confirmPassword"
            value={cpassword}
            helperText={passwordHelperText}
            onChange={e => setCpassword(e.target.value)}
            label=" Confirm Password"
            type="password"
            autoComplete="new-password"
          />
          {password.length > 0 ? (
            <PasswordStrengthBar
              password={password}
              onChangeScore={score => {
                setPasswordScore(score);
                console.log(score);
              }}
            />
          ) : (
            <p />
          )}

          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={register}
            className={classes.submit}
          >
            Register!
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/login" variant="body2">
                {"Already have an account? Log in"}
              </Link>
            </Grid>
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
      />
    </Container>
  );
}
