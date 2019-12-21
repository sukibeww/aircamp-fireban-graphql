const express = require('express')
const router = express.Router();
const { getRSA } = require('../controller/RSA-controller')

router.post('/rsa', getRSA )

module.exports = router;