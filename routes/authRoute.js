const express = require('express');
const router = express.Router();
const { 
    createUser,
    loginUserCtrl,
    getAllUsers,
    userCart,
    getWishlist
} = require('../controller/user.js');
const authMiddleware = require('../middleware/authMiddeware.js');

router.post("/register", createUser);
router.get("/getall", getAllUsers)
router.post("/login", loginUserCtrl);
router.get("/wishlist", authMiddleware, getWishlist);
router.post("/cart", authMiddleware, userCart);


module.exports = router; 