const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true, // The name of the user making the payment
    trim: true,
  },
  orderId: {
    type: String,
    required: true, // Razorpay order ID
  },
  paymentId: {
    type: String,
    required: true, // Razorpay payment ID
  },
  amount: {
    type: Number,
    required: true, // Payment amount in paise
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically store the timestamp of the payment
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
