const express = require("express");
const {
    createProduct,
    getaProduct,
    updateProduct,
    getAllProduct,
    deleteProduct
} = require("../controller/productCtrl.js");
const router = express.Router();

router.post("/", createProduct);
router.get("/:id", getaProduct);
router.put("/:id", updateProduct);
router.get('/',getAllProduct);
router.delete('/:id',deleteProduct)

module.exports = router;