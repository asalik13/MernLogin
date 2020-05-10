import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./Login/Login.component";
import Register from "./Login/Register.component";
import Secret from "./Login/Secret.component";
import ResetPage from "./Login/Reset.component";
import ForgotPage from "./Login/Forgot.component";
import Verify from "./Login/Verify.component";




function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route
          path="/Login"
          render={props => {
            return <Login {...props} />;
          }}
        />
        <Route
          path="/register"
          render={props => {
            return <Register {...props} />;
          }}
        />

        <Route path="/register" component={Register} />
        <Route path="/secret" component={Secret} />
        <Route path="/reset/:ident/:today-:hash" component={ResetPage} />
        <Route path="/verify/:ident/:today-:hash" component={Verify} />
        <Route path="/forgot" component={ForgotPage} />
      </Switch>
    </Router>
  );
}

export default App;
