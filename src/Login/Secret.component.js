import React, { useState, useEffect } from "react";
import Axios from "axios";
import Logout from "./Logout.component.js";
import { useHistory } from "react-router-dom";
import api from "../utils/config"


Axios.defaults.withCredentials = true;

export default function Secret() {
  let [data, setData] = useState("");
  let history = useHistory();

  useEffect(() => {
    Axios(api.secret, {
      method: "get"
    })
      .then(res => {
        setData(res.data.id);
      })
      .catch(err => history.push("/login"));

  });



  return (
    <div>
      <h6> {data}</h6>
      <Logout />
    </div>
  );
}
