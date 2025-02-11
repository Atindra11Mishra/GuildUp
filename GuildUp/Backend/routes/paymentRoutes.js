const express = require("express");
const razorpay = require("../config/razorpay.js");
const crypto = require("crypto");
const Payment = require("../models/Payment.js"); // Import Payment model
const Booking = require("../models/bookingModel"); // Import Booking model
const Expert = require("../models/ExpertModel.js"); // Import Expert model
const transporter = require("../config/email.js"); // Import nodemailer transporter

const router = express.Router();

// Create an order
router.post("/create-order/:expertId", async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const options = {
      amount: amount, // Amount in paise
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ success: false, message: "Failed to create Razorpay order" });
  }
});

router.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userName, amount,expertId } = req.body;
    
    console.log("Received expertId:", expertId);

   
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userName || !amount || !expertId) {
      console.error("Missing required fields:", { ...req.body, expertId });
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    // Verify Razorpay signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature." });
    }

    // Store payment details in the database
    const payment = await Payment.create({
      userName,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      amount,
    });

   
    
    const expert = await Expert.findById(expertId);
    if (!expert || !expert.email) {
      return res.status(404).json({ success: false, message: "Expert not found or email not provided." });
    }

    // Send an email to the expert
    const mailOptions = {
      from: 'process.env.EMAIL_USER',
      to: expert.email,
      subject: "New Booking and Payment Confirmation",
      html: `
        <h1>New Booking Confirmation</h1>
        <p>You have a new booking with the following details:</p>
        <ul>
          <li><strong>Booking ID:</strong> ${expert._id}</li>
          <li><strong>Client Name:</strong> ${userName}</li>
          
        </ul>
        <p>Thank you for using our platform!</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Payment verified and stored successfully. Email sent to the expert.",
      payment,
    });
  } 
  catch (error) {
    console.error("Error verifying payment or sending email:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});


module.exports = router;
