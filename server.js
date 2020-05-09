require("dotenv").config();

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const mongoose = require("mongoose");
const errorHandler = require("errorhandler");
const FileStore = require("session-file-store")(session);
const passport = require("passport");
const MongoStore = require('connect-mongo')(session);

require ("./Models/User.model.js")
require("./config/passport");

//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

//Configure isProduction variable
const isProduction = process.env.NODE_ENV === "production";
const PORT = process.env.PORT||8000
const host = process.env.HOST;


//Initiate our app
const app = express();
app.use(express.static(path.join(__dirname, 'Client/build')))

app.use(
  cors({
    credentials: true,
    origin: host
  })
);

app.disable("etag");

//Configure our app
app.use(cors());
app.use(require("morgan")("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(function(req, res, next) {
  res.set("credentials","include")
  res.set("Access-Control-Allow-Origin", host);
  res.set("Access-Control-Allow-Credentials", true);
  res.set(
    "Access-Control-Allow-Headers",
    "Origin, X-PINGOTHER, Content-Type, Authorization"
  );
  res.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS"
  );



  next();
});

//Connect to database
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});
const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});



app.use(
  session({
    secret: process.env.token_secret,
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({ mongooseConnection: connection }),

    cookie: {
      secure: false,
      httpOnly: false ,
      maxAge: 60000 * 60 * 24
    }
  })
);




app.use(passport.initialize());
app.use(passport.session());
app.use(require("./routes"));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'Client/build', 'index.html'));
});


if (!isProduction) {
  app.use(errorHandler());
}





app.listen(PORT, () => console.log("Server running on port " + PORT));
