let link = "http://localhost:5000"
export default {
  link: link,
  login: link + "/login",
  register: link + "/register",
  forgot: link + "/forgot",
  logout:link+"/logout",
  secret:link+"/secret",

  reset: data => {
    return link + "/reset/" + data.ident + "/" + data.today + "-" + data.hash;
  },
  verify:data => {
    return link + "/verify/" + data.ident + "/" + data.today + "-" + data.hash;
  },
  resetVerify:data => {
    return link + "/reset/verify/" + data.ident + "/" + data.today + "-" + data.hash;
  },


};
