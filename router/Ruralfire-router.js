const express = require('express')
const router = express.Router();
const { getRuralfire } = require('../controller/Ruralfire-controller')

router.post('/ruralfire', getRuralfire )

module.exports = router;