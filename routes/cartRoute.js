const express = require('express');
const router = express.Router();
const {
    addUserCart
}=  require('../controller/cart');
const authMiddleware = require('../middleware/authMiddeware.js');

router.post('/addtocart',authMiddleware,addUserCart)

module.exports = router;