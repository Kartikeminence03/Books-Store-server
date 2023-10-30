const express = require('express');
const router = express.Router();
const {
    paymentVerification
} = require('../controller/paymentController');

router.post('/paymentVerification', paymentVerification)

module.exports = router;