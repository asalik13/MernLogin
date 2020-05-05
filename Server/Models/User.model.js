const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const { Schema } = mongoose;

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


const UsersSchema = new Schema({
  email: {type:String,unique:true},
  firstName: String,
  lastName: String,
  number: String,
  lastLoginDate: Date,
  lastLogoutDate: Date,
  hash: String,
  salt: String,
  active:{type:Boolean,default:false}
});

UsersSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};

UsersSchema.methods.generateHash = function(){
  const today = base64Encode(new Date().toISOString());
  const ident = base64Encode(this._id.toString());
  const data = {
    today: today,
    userId: this._id,
    lastLogin: this.lastLoginDate.toISOString(),
    password: this.salt,
    email: this.email
  };
  const hash = sha256(JSON.stringify(data), process.env.token_secret);
  return ident + "/" + today + "-" + hash;
}

UsersSchema.methods.generateVerifyHash = function(){
  const today = base64Encode(new Date().toISOString());
  const ident = base64Encode(this._id.toString());
  const data = {
    today: today,
    userId: this._id,
    password: this.salt,
    email: this.email
  };
  const hash = sha256(JSON.stringify(data), process.env.token_secret);
  return ident + "/" + today + "-" + hash;
}



UsersSchema.methods.validatePassword = function(password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.hash === hash;
};

UsersSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      email: this.email,
      id: this._id,
      exp: parseInt(expirationDate.getTime() / 1000, 10)
    },
    "secret"
  );
};

UsersSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    email: this.email,
    token: this.generateJWT()
  };
};

mongoose.model("Users", UsersSchema);
