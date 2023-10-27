const express = require('express');
const router = express.Router();
const { createOrder } = require('../controller/orderController')
const authMiddleware = require('../middleware/authMiddeware.js');

router.post("/create-order", authMiddleware, createOrder);

module.exports = router;

