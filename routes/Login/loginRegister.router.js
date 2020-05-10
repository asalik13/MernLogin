const mongoose = require("mongoose");
const passport = require("passport");
const router = require("express").Router();
const Users = mongoose.model("Users");
const host = process.env.HOST;
let sendMail = require("../../config/email");

router.post("/login", passport.authenticate("local"), function(req, res) {
  if(!req.user.active){
    req.session.destroy();
    return res.json({ error: "please verify email" });
  }
  req.user.lastLoginDate = Date.now()
  req.user.save()
  return res.status(200).json({user:req.user})
  /*Users.findById(req.user._id, function(err, user, info) {
    if (!user.active) {

    }
    user.lastLoginDate = Date.now();
     res.status(200).json({ user: user });
     user.save();

  });*/
});

router.post("/register", (req, res, next) => {
  const {
    body: { user }
  } = req;

  if (!user.email) {
    return res.status(422).json({
      errors: {
        email: "is required"
      }
    });
  }

  if (!user.password) {
    return res.status(422).json({
      errors: {
        password: "is required"
      }
    });
  }
  Users.exists({ email: user.email }, (err, result) => {
    if (err) {
      return res.send(err);
    }
    if (result) {
      return res.json({
        email: "Already exists"
      });
    } else {
      const finalUser = new Users(user);

      finalUser.setPassword(user.password);
      finalUser.active = false;

      return finalUser.save().then(() => {
        res.status(200).json({ user: finalUser});
        let link = host + "/verify/" + finalUser.generateVerifyHash();
        sendMail(
          finalUser.email,
          "Please confirm your Email account",
          "Hello,<br> Please Click on the link to verify your email.<br><a href=" +
            link +
            ">Click here to verify</a>"
        );
      });
    }
  });
});

function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).json({ id: "Not Authorised" });
  }
}
router.get("/secret", checkAuthentication, (req, res) =>
   res.status(200).json(req.user)
);

router.post("/logout", checkAuthentication, (req, res) => {
  Users.findById(req.user._id, function(err, user) {
    user.lastLogoutDate = Date.now();
    user.save();
    req.session.destroy();
  });
  return res.json({ text: "logged out" });
});

module.exports = router;
