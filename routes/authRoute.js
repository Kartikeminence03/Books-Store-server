const express = require('express');
const router = express.Router();
const { 
    createUser,
    loginUserCtrl,
    getAllUsers,
    userCart,
    getWishlist,
    getUserCart,
    emptyCart,
    createOrder,
    removeUserCart,
} = require('../controller/user.js');
const authMiddleware = require('../middleware/authMiddeware.js');

router.post("/register", createUser);
router.get("/getall", getAllUsers)
router.post("/login", loginUserCtrl);
router.get("/wishlist", authMiddleware, getWishlist);
router.post("/cart/cash-order", authMiddleware, createOrder);
router.get("/cart", authMiddleware, getUserCart);
router.post("/cart", authMiddleware, userCart);
router.post('/remove-cart', authMiddleware, removeUserCart)
router.delete("/empty-cart", authMiddleware, emptyCart)

module.exports = router; 