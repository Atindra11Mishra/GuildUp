const Expert = require("../models/ExpertModel.js");

// Get experts by name
exports.getExpertsByName = async (req, res) => {
  try {
    const { name } = req.query; // Get the name from query parameters
    const experts = await Expert.find({ name: new RegExp(name, "i") }); // Case-insensitive search
    res.status(200).json({ experts });
  } catch (error) {
    console.error("Error fetching expert by name:", error);
    res.status(500).json({ error: "Failed to fetch experts by name." });
  }
};
