const Razorpay = require("razorpay");
const User = require("../models/user");
const Order = require("../models/orderModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_AIP_KEY,
    key_secret: process.env.RAZORPAY_AIP_SECRET,
});

const createOrder = asyncHandler(async(req,res)=>{
  const { products, totalAmount } = req.body;
      const { _id } = req.user;
    const options = {
         amount: Number(totalAmount*100),
        currency: "INR",
      }
    try {
      validateMongoDbId(_id)
      const user = await User.findById(_id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const order = await instance.orders.create(options);
  
      let newOrder = new Order({
        user: user._id,
        totalAmount,
        products,
      });
  
      user.cart = [];
      await user.save();
      await newOrder.save();
  
  
      res.json({
        status: true,
        message: "order successfully",
        newOrder,
        orderResponse: order,

      });
    } catch (error) {
      throw new Error(error);
    }
});


const getOrder = asyncHandler(async(req,res)=>{
  try {
    const { _id } = req.user;

    const orders = await Order.find({ user: _id });

    res
      .status(200)
      .json({ status: true, message: "orders get successfully", orders });
  } catch (error) {
    return res
    .status(400)
    .json({ status: false, message: `${error}` })
  }
})

module.exports = {
    createOrder,
    getOrder
}
  