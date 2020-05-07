import React, { useState, useEffect } from "react";
import Axios from "axios";
import Logout from "./Logout.component.js";
import { useHistory } from "react-router-dom";
import api from "../utils/config"


Axios.defaults.withCredentials = true;

export default function Verify(props) {
  let history = useHistory();
  useEffect(() => {

    Axios(api.verify(props.match.params), {
      method: "post"
    })
      .then(res => {
        history.push("/secret")
      })
      .catch(err => history.push("/login"));

  });



  return (
    <div>
      <h6> Verifying Email..</h6>

    </div>
  );

}
