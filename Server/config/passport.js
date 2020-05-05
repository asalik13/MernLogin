const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
var GoogleStrategy = require("passport-google-oauth").OAuthStrategy;

const Users = mongoose.model("Users");

passport.use(
  new LocalStrategy(
    {
      usernameField: "user[email]",
      passwordField: "user[password]",
    },
    (email, password, done) => {
      Users.findOne({ email })
        .then(user => {
          if (!user || !user.validatePassword(password)) {
            return done(null, false, {
              errors: { "email or password": "is invalid" }
            });
          }

          return done(null, user);
        })
        .catch(done);
    }
  )
);



passport.serializeUser(function(user, done) {
  console.log("serialised user");
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  Users.findById(id, function(err, user) {
    if (err) return done(err, user);
    console.log("deserialised" + user._id);
    done(err, user);
  });
});
