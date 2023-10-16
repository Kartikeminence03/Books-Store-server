const express = require("express");
const {
    createProduct,
    getaProduct,
    updateProduct
} = require("../controller/productCtrl.js");
const router = express.Router();

router.post("/", createProduct);
router.get("/:id", getaProduct);
router.put("/:id", updateProduct);

module.exports = router;