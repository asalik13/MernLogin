

//let link = "https://young-garden-77767.herokuapp.com/api"

let link = "https://asalik13-loginserver.herokuapp.com/api"

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
