const express = require('express');
const router = express.Router();
const { createOrder,getOrder } = require('../controller/orderController')
const authMiddleware = require('../middleware/authMiddeware.js');

router.post("/create-order", authMiddleware, createOrder);
router.get("/us-order", authMiddleware, getOrder)

module.exports = router;

