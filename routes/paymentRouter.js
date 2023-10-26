const express = require('express');
const router = express.Router();
const { 
    checkout,
    paymentVerification
} = require('../controller/paymentController');
const authMiddleware = require('../middleware/authMiddeware.js');

router.post('/payment-checkout',authMiddleware, checkout)
router.post('/paymentVerification', paymentVerification)

module.exports = router;