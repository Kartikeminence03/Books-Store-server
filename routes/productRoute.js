const express = require("express");
const {
    createProduct,
    getaProduct,
    updateProduct,
    getAllProduct,
    deleteProduct,
} = require("../controller/productCtrl.js");
const authMiddleware = require('../middleware/authMiddeware.js');
const router = express.Router();

router.post("/", authMiddleware, createProduct);
router.get("/:id", getaProduct);
router.put("/:id", updateProduct);
router.get('/',getAllProduct);
router.delete('/:id',deleteProduct);


module.exports = router;