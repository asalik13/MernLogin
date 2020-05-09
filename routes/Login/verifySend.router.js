var express = require("express");
var nodemailer = require("nodemailer");
var router = express.Router();
let sendMail = require("../../config/email")
const mongoose = require("mongoose");

const moment = require("moment");
const Users = mongoose.model("Users");
const crypto = require("crypto");





const base64Encode = data => {
  let buff = new Buffer.from(data);
  return buff.toString("base64");
};

const base64Decode = data => {
  let buff = new Buffer.from(data, "base64");
  return buff.toString("ascii");
};

const sha256 = (salt, password) => {
  var hash = crypto.createHash("sha512", password);
  hash.update(salt);
  var value = hash.digest("hex");
  return value;
};

router.post("/verify/:ident/:today-:hash", (req, res) => {
  try {
    // Check if the link in not out of date
    const today = base64Decode(req.params.today);
    const then = moment(today);
    const now = moment().utc();
    const timeSince = now.diff(then, "hours");
    if (timeSince > 2) {
      res.status(500).send({ error: "The link is invalid.", errnum: -1 });
      return;
    }

    const userId = base64Decode(req.params.ident);

    let query = Users.where({ _id: userId });
    query.select("_id salt email");
    query.findOne((err, user) => {
      if (err) {
        res.status(500).send({ error: err.message, errnum: -2 });
        return;
      }
      if (!user) {
        res.status(404).send({ error: "Account not found!", errnum: -3 });
        return;
      }

      // Hash again all the data to compare it with the link
      // THe link in invalid when:
      // 1. If the lastLoginDate is changed, user has already do a login
      // 2. If the salt is changed, the user has already changed the password
      const data = {
        today: req.params.today,
        userId: user._id,
        password: user.salt,
        email: user.email
      };
      const hash = sha256(JSON.stringify(data), process.env.token_secret);

      if (hash !== req.params.hash) {
        res.status(500).send({ error: "The link is invalid.", errnum: -4 });
        return;
      }
      user.active = true;
      req.login(user,(err)=>{
        console.log(err)
      })
      user.save();
      return res.status(200).json({ verified: true });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error:
        "Unexpected error during the password reset process :| " + err.message,
      errnum: -99
    });
    return;
  }
});
module.exports = router;
