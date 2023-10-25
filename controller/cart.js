const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const User = require('../models/user');
const Product = require('../models/productModel')


const addUserCart = async (req, res) => {
    try {
      const {_id } = req.user;
      const { productId } = req.body;
      const user = await User.findById(new ObjectId(_id).toString());
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (user.cart.includes(new ObjectId(productId).toString())) {
        return res
          .status(400)
          .json({ status: true, message: "Product is already in cart" });
      }
  
      user.cart.push(productId);
      await user.save();
  
      const product = await Product.findById(productId);
      res.status(200).json({
        status: true,
        message: "Product added to cart",
        product,
      });
    } catch (err) {
      return res
        .status(400)
        .json({ status: false, message: "Internal server error" });
    }
};

module.exports = {addUserCart}