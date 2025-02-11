const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  expertId: {
    type: mongoose.Schema.Types.ObjectId, // References the ID of the expert from the Expert collection
    required: true,
    ref: "Expert", // Reference to the Expert model
  },
  date: {
    type: Date, // Date of the booking
    required: true,
  },
  time: {
    type: String, // Time of the booking in HH:mm format
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically stores the time the booking was created
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
