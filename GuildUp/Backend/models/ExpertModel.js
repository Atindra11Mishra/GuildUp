const mongoose = require("mongoose");

const expertSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Name is mandatory
    trim: true, // Remove unnecessary whitespace
  },
  email: {
    type: String,
    required: true, // Email is mandatory
    unique: true, // Ensure each expert has a unique email
    trim: true,
  },
  specialization: {
    type: String,
    required: true, // Specialization is mandatory
    trim: true,
  },
  phone: {
    type: String,
    required: true, // Phone number is mandatory
    trim: true,
  },
  availability: {
    type: [String], // Array of available dates/times
    default: [], // Default to empty array if not provided
  },
});

module.exports = mongoose.model("Expert", expertSchema);
