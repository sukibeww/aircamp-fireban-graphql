const express = require('express')
const router = express.Router();
const { getRuralfire } = require('../controller/Ruralfire-controller')

router.get('/ruralfire', getRuralfire )

module.exports = router;