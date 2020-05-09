import React, { useState, useEffect } from "react";
import Axios from "axios";
import Logout from "./Logout.component.js";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import api from "../utils/config";

Axios.defaults.withCredentials = true;

function Reset(props) {
  
  function reset() {
    Axios.post(api.forgot, { email: props.email });
  }

  return <Button onClick={reset} > Reset </Button>;
}

export default function Secret() {
  let [user, setUser] = useState("");
  let [status, setStatus] = useState(0);

  let history = useHistory();

  useEffect(() => {
    Axios(api.secret, {
      method: "get"
    })
      .then(res => {
        setUser(res.data);
        setStatus(res.status)
      })
      .catch(err => setStatus(401));
  },[]);

  if (status === 0) {
    return <h6> loading... </h6>;
  } else if (status === 200) {
    return (
      <div>
        <h6> {user.firstName + " just logged in!"} </h6>
        <Logout />
        <Reset email={user.email} />
      </div>
    );
  } else {
    history.push("/login")
  }
}
