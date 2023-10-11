const express = require('express');
const User = require('../model/user')
const router =  express.Router();
const ErrorHandler = require('../utils/ErrorHandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const jwt = require('jsonwebtoken');

router.get('/',(req,res)=>{
    res.send("Hi I'm books store API")
});

module.exports = router;