import React from "react"
import Axios from "axios"
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import api from "../utils/config"



export default function Logout(){
  let history = useHistory();

  let logout = ()=>{
    history.push("/login")
    Axios.post(api.logout)


  }
  return(<Button onClick = {logout}>Logout</Button>)
}
