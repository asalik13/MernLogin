import React, { useState, useEffect } from "react";
import Axios from "axios";
import Logout from "./Logout.component.js";
import { useHistory, Redirect } from "react-router-dom";
import api from "../utils/config";

Axios.defaults.withCredentials = true;

export default function Verify(props) {
  let [verified, setVerified] = useState("loading");
  let history = useHistory();
  useEffect(() => {
    Axios(api.verify(props.match.params), {
      method: "post"
    })
      .then(res => {
        setVerified(res.status === 200);
      })
      .catch(err => setVerified(false));
  });

  if (verified === "loading") {
    return (<h6> Verifying Email... </h6>);
  } else if (verified) {
    return (<Redirect to="/secret" />);
  } else {
    return(<h6> Sorry. Invalid Link </h6>)
  }
}
