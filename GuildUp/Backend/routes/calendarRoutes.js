const express = require("express");
const { createEvent } = require("../controllers/calendarController.js");

const router = express.Router();

// Use :expertId as a route parameter
router.post("/event/:expertId", createEvent);

module.exports = router;

