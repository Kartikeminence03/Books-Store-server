// const express = require('express');
const User = require('../models/user')
const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken');
const { generateRefreshToken } = require('../config/refreshtoken');
const { generateToken } = require('../config/jwtToken');

let users = User;

const getAllUsers = async (req,res)=>{
    let result = await users.find()
    res.send(result)
};

const createUser = asyncHandler(async(req,res)=>{
  // console.log(req.body);
        const email = req.body.email;
        const password =  req.body.password;
        const findUser = await User.findOne({email});
        const findUserPass = await User.findOne({password});
        if(!findUser && !findUserPass) {
            // Create a new User
            const newUser = await User.create(req.body);
            res.json(newUser);
        } else {
            //User Already Exists
            throw new Error("User Already Exists");
        }
});

// Login a user
const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // check if user exists or not
    const findUser = await User.findOne({ email });
    if (findUser && (await findUser.isPasswordMatched(password))) {
      const refreshToken = await generateRefreshToken(findUser?._id);
      const updateuser = await User.findByIdAndUpdate(
        findUser.id,
        {
          refreshToken: refreshToken,
        },
        { new: true }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });
      res.json({
        _id: findUser?._id,
        firstname: findUser?.firstname,
        lastname: findUser?.lastname,
        email: findUser?.email,
        mobile: findUser?.mobile,
        token: generateToken(findUser?._id),
      });
    } else {
      throw new Error("Invalid Credentials");
    }
  });

module.exports = {
    createUser,
    loginUserCtrl,
    getAllUsers
};