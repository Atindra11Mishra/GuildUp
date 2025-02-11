const mongoose = require("mongoose");
const Expert = require("../models/ExpertModel.js");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("Connected to MongoDB");

    const experts = [
      {
        name: "Ananya",
        email: "thejokerburgers@gmail.com",
        specialization: "Career Guidance",
        phone: "7067601245",
        availability: ["2025-02-15T10:00:00", "2025-02-15T11:00:00"],
      },
      {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        specialization: "Mental Health Counseling",
        phone: "9876543211",
        availability: ["2025-02-16T14:00:00", "2025-02-16T15:00:00"],
      },
    ];

    await Expert.insertMany(experts);
    console.log("Experts inserted successfully");

    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error inserting experts:", err);
  });
