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
         amount: Number(totalAmount*100),//Number(req.body.amount * 100),  // amount in the smallest currency unit
        currency: "INR",
      }

      console.log(req.body.amount);

      console.log(_id);
    try {
      validateMongoDbId(_id)
      const user = await User.findById(_id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const order = await instance.orders.create(options);
      // console.log(order,"=======>>>>>>>>>>>>>");
      // console.log(products);
  
      let newOrder = new Order({
        user: user._id,
        totalAmount,
        products,
      });

      console.log(newOrder,"========........<<<<<<<");
  
      user.cart = [];
      await user.save();
      await newOrder.save();

      console.log(newOrder);
  
  
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

module.exports = {
    createOrder
}
  