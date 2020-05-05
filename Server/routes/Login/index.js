const express = require('express');
const router = express.Router();

router.use(require('./loginRegister.router'));
router.use(require('./verifySend.router'));
router.use(require('./forgotReset.router'))


module.exports = router;
