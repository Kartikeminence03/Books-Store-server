const Razorpay = require("razorpay");

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_AIP_KEY,
    key_secret: process.env.RAZORPAY_AIP_SECRET,
});
const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const Payment = require('../models/paymentModel');
const Order = require("../models/orderModel");


const checkout = asyncHandler(async (req,res)=>{
    const options = {
        amount: Number(req.body.amount * 100),  // amount in the smallest currency unit
        currency: "INR",
      };
    const order = await instance.orders.create(options);
    // console.log(order);

    res.status(200).json({
        success: true,
        order
    })
})

const paymentVerification = asyncHandler(async (req, res) => {
  const { order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

    // console.log(razorpay_signature);

    // console.log(razorpay_order_id," = ", razorpay_payment_id, " = ", razorpay_signature);

  // const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256",razorpay_order_id + "|" + razorpay_payment_id, process.env.RAZORPAY_APT_SECRET)
    // .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature == razorpay_signature;

  const order = await Order.findById(order_id);
    if (!order) {
      return res.status(404).json({
        status: false,
        message: "Order not found",
      });
    }

  // console.log(!isAuthentic);

  if (!isAuthentic) {
    // Database comes here

    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order: order._id,
    });

    order.status = "success";
    await order.save();

    res.redirect(
      `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
    );
  } else {
    res.status(400).json({
      success: false,
    });
  }


  // res.status(200).json({
  //   success: true,
  // })

});

module.exports = {
    checkout,
    paymentVerification
};