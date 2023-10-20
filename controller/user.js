const { generateToken } = require('../config/jwtToken');
const User = require('../models/user');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const asyncHandler = require("express-async-handler");
const uniqid = require('uniqid'); 
const validateMongoDbId = require("../utils/validateMongodbId");
const jwt = require('jsonwebtoken');
const { generateRefreshToken } = require('../config/refreshtoken');


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

const getWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const findUser = await User.findById(_id).populate("wishlist");
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

// User cart api
const userCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    let products = [];
    const user = await User.findById(_id);
    // check if user already have product in cart
    const alreadyExistCart = await Cart.findOne({ orderby: user._id });
    if (alreadyExistCart) {
      alreadyExistCart.$isDeleted();
    }
    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.count = cart[i].count;
      let getPrice = await Product.findById(cart[i]._id).select("price").exec();
      object.price = getPrice.price;
      products.push(object);
    }

    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }
    let newCart = await new Cart({
      products,
      cartTotal,
      orderby: user?._id,
    }).save();
    res.json(newCart);
  } catch (error) {
    throw new Error(error);
  }
});


const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const cart = await Cart.findOne({ orderby: _id }).populate(
      "products.product"
    );
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

const emptyCart = asyncHandler(async(req,res)=>{
  const {_id } = req.user;
  validateMongoDbId(_id);
  try {
    const userId = await User.findById(_id);
    const cart = await Cart.findOneAndRemove({orderby: userId._id})
    res.json(cart)
  } catch (error) {
    throw new Error(error)
  }
})


//Orders

const createOrder = asyncHandler(async(req,res)=>{
  const { COD } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id)
  try {
    if (!COD) throw new Error("Create cash order failed");
    const user = await User.findById(_id);
    let userCart = await Cart.findOne({ orderby: user._id });
    let finalAmout = 0;
    if (userCart) {
      finalAmout = userCart;
    } else {
      finalAmout = userCart.cartTotal;
    }

    let newOrder = await new Order({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: "COD",
        amount: finalAmout,
        status: "Cash on Delivery",
        created: Date.now(),
        currency: "usd",
      },
      orderby: user._id,
      orderStatus: "Cash on Delivery",
    }).save();
    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });
    console.log(update);
    const updated = await Product.bulkWrite(update, {});
    res.json({ message: "success" });
  } catch (error) {
    throw new Error(error);
  }
})

module.exports = {
    createUser,
    loginUserCtrl,
    getAllUsers,
    userCart,
    getWishlist,
    getUserCart,
    emptyCart,
    createOrder,
};