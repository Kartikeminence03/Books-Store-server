const Product = require('../models/productModel');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const validateMongoDbId = require('../utils/validateMongodbId');

// Create Product 
const createProduct = asyncHandler(async (req, res) => {
    try {
      if (req.body.title) {
        req.body.slug = slugify(req.body.title);
      }
      const newProduct = await Product.create(req.body);
      res.json(newProduct);
    } catch (error) {
      throw new Error(error);
    }
});

// Update user by ID
const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      if (req.body.title) {
        req.body.slug = slugify(req.body.title);
      }
      const updateProduct = await Product.findByIdAndUpdate( id , req.body, {
        new: true,
      });
      res.json(updateProduct);
    } catch (error) {
      throw new Error(error);
    }
});

const deleteProduct = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id)
    try {
        const deleteProduct = await Product.findByIdAndDelete(id);
        res.json(deleteProduct)
    } catch (error) {
        throw new Error(error)
    }
})

// Get Product by ID
const getaProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const findProduct = await Product.findById(id);
      res.json(findProduct);
    } catch (error) {
      throw new Error(error);
    }
});

const getAllProduct = asyncHandler(async(req,res)=>{
    try {
        const getallproduct = await Product.find();
        res.json(getallproduct)
    } catch (error) {
        throw new Error(error)
    }
});


//Add to wish list
const addToWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;
  console.log(_id);
  try {
    const userId = await User.findById(_id);
    const alreadyadded = userId.wishlist.find((id) => id.toString() === prodId);
    // console.log(userId);
    if (alreadyadded) {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: prodId },
        },
        {
          new: true,
        }
      );
      res.json(user);
    } else {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: prodId },
        },
        {
          new: true,
        }
      );
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});



module.exports = {
    createProduct,
    getaProduct,
    updateProduct,
    getAllProduct,
    deleteProduct,
    addToWishlist,
}