const express = require('express');
const router = express.Router();

const host = process.env.HOST;


router.use(function(req, res, next) {
  res.header("credentials","include")
  res.header("Access-Control-Allow-Origin", host);
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-PINGOTHER, Content-Type, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS"
  );



  next();
});

router.use(require('./loginRegister.router'));
router.use(require('./verifySend.router'));
router.use(require('./forgotReset.router'))


module.exports = router;
