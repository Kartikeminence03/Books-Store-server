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
    getAllOrders,
} = require('../controller/user.js');
const authMiddleware = require('../middleware/authMiddeware.js');

router.post("/register", createUser);
router.get("/getall", getAllUsers)
router.post("/login", loginUserCtrl);
router.get("/wishlist", authMiddleware, getWishlist);
// router.post("/cart/cash-order", authMiddleware, createOrder);
router.get("/getallorders", authMiddleware, getAllOrders);
router.get("/cart", authMiddleware, getUserCart);
router.post("/cart", authMiddleware, userCart);
router.delete("/empty-cart", authMiddleware, emptyCart)

module.exports = router; 