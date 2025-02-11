const express = require("express");
const { getExpertsByName } = require("../controllers/expertController");

const router = express.Router();

// Route to fetch experts by name
router.get("/experts", getExpertsByName);

module.exports = router;
