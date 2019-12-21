const express = require('express')
const router = express.Router();
const { getCFA, processContent} = require('../controller/CFA-controller')


router.post('/cfa', getCFA )

module.exports = router;