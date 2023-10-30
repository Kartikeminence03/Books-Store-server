const express = require('express');
const router = express.Router();
const { 
    createUser,
    loginUserCtrl,
    getAllUsers,
} = require('../controller/user.js');

router.post("/register", createUser);
router.get("/getall", getAllUsers)
router.post("/login", loginUserCtrl);

module.exports = router; 