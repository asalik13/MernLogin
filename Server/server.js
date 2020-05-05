const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const uuid = require("uuid/v4");
const session = require("express-session");
const cors = require("cors");
const mongoose = require("mongoose");
const errorHandler = require("errorhandler");
const FileStore = require("session-file-store")(session);
const passport = require("passport");
require("./models/User.model");
require("./config/passport");
require("dotenv").config();

//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

//Configure isProduction variable
const isProduction = process.env.NODE_ENV === "production";

//Initiate our app
const app = express();
app.use(cors({
  credentials: true,
  origin: "http://localhost:3000"
}));

app.disable('etag');


//Configure our app
app.use(cors());
app.use(require("morgan")("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(
  session({
    secret: process.env.token_secret,
    saveUninitialized: true,
    resave: true,
    domain:'http://localhost:3000',

    cookie: {
        secure: false,
        maxAge:60000*60*24
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(require("./routes"));


if (!isProduction) {
  app.use(errorHandler());
}

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


app.listen(8000, () => console.log("Server running on http://localhost:8000/"));
