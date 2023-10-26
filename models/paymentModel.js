const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
    {
        razorpay_order_id: {
          type: String,
          required: true,
        },
        razorpay_payment_id: {
          type: String,
          required: true,
        },
        razorpay_signature: {
          type: String,
          required: true,
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
        },
      },
      { timestamps: { createdAt: true, updatedAt: true } }
)

module.exports = mongoose.model("Payment", paymentSchema);