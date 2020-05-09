const router = require("express").Router();
const mongoose = require("mongoose");
const Users = mongoose.model("Users");
const crypto = require("crypto");
const moment = require("moment");
const host = process.env.HOST;
const sendMail = require("../../config/email");

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

router.post("/forgot", (req, res) => {
  try {
    const email = req.body.email;

    // Getting the user, only if active
    let query = Users.where({ email: email });
    query.select("_id salt username lastLoginDate");
    query.findOne((err, user) => {
      if (err) {
        res.status(500).send({ error: err.message, errnum: -1 });
        return;
      }
      if (!user) {
        res.status(404).send({ error: "Account not found!", errnum: -2 });
        return;
      }

      let link = host + "/reset/" + user.generateHash();
      sendMail(
        email,
        "Forgot your password? We gotchu",
        "Hello,<br> Please Click on the link to reset your password.It will expire in 2 hours.<br><a href=" +
          link +
          ">Reset Password</a>"
      );
      return res.status(200).json({ status: "email sent" });
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

router.post("/reset/verify/:ident/:today-:hash", (req, res) => {
  try {
    // Check if the link in not out of date
    const today = base64Decode(req.params.today);
    const then = moment(today);
    const now = moment().utc();
    const timeSince = now.diff(then, "hours");
    if (timeSince > 2) {
      return res.status(500).json({ verified: false });
    }

    const userId = base64Decode(req.params.ident);

    // Getting the user, only if active
    let query = Users.where({ _id: userId });
    query.select("_id salt username lastLoginDate");
    query.findOne((err, user) => {
      if (err) {
        return res.status(500).json({ verified: false });
      }
      if (!user) {
        return res.status(404).json({ verified: false });
      }

      // Hash again all the data to compare it with the link
      // THe link in invalid when:
      // 1. If the lastLoginDate is changed, user has already do a login
      // 2. If the salt is changed, the user has already changed the password
      const data = {
        today: req.params.today,
        userId: user._id,
        lastLogin: user.lastLoginDate.toISOString(),
        password: user.salt,
        email: user.email
      };
      const hash = sha256(JSON.stringify(data), process.env.token_secret);

      if (hash !== req.params.hash) {
        return res.status(500).json({ verified: false });
      }
      return res.status(200).json({ verified: false });
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

router.post("/reset/:ident/:today-:hash", (req, res) => {
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

    // Getting the user, only if active
    let query = Users.where({ _id: userId });
    query.select("_id salt username lastLoginDate");
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
        lastLogin: user.lastLoginDate.toISOString(),
        password: user.salt,
        email: user.email
      };
      const hash = sha256(JSON.stringify(data), process.env.token_secret);

      if (hash !== req.params.hash) {
        res.status(500).send({ error: "The link is invalid.", errnum: -4 });
        return;
      }
      user.setPassword(req.body.password);
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
