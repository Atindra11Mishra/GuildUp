const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  amount: {
    value: { type: Number, default: 10000 },
    currency: { type: String, default: "INR" }
  },
});

module.exports = mongoose.model("User", UserSchema);
