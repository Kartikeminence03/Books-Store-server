const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
      price: {
        type: Number,
        required: true,
    },
    //   category: {
    //     type: String,
    //     required: true,
    // },
    totalrating: {
        type: String,
        default: 0,
    },
}, { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);