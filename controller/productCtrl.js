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



module.exports = {
    createProduct,
    getaProduct,
    updateProduct,
    getAllProduct,
    deleteProduct,
}