const mongoose = require("mongoose"); // For ObjectId validation
const { calendar } = require("../config/googleAuth");
const Booking = require("../models/bookingModel");

exports.createEvent = async (req, res) => {
  try {
    const { expertId } = req.params; // Extract expertId from req.params
    const { date, time } = req.body; // Extract date and time from req.body

    // Validate required fields
    if (!expertId || !date || !time) {
      return res.status(400).json({ error: "Expert ID, date, and time are required." });
    }

    // Validate and convert `expertId` to ObjectId
    if (!mongoose.Types.ObjectId.isValid(expertId)) {
      return res.status(400).json({ error: "Invalid Expert ID format." });
    }

    const objectIdExpertId = new mongoose.Types.ObjectId(expertId); // Use `new` keyword

    // Combine date and time into a single DateTime object
    const startDateTime = new Date(`${date}T${time}`);
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(endDateTime.getHours() + 1); // Default duration: 1 hour

    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      return res.status(400).json({ error: "Invalid date or time format." });
    }

    // Save the booking to the database
    const booking = await Booking.create({
      expertId: objectIdExpertId,
      date: startDateTime,
      time,
    });

    // Create a Google Calendar event
    const event = {
      summary: `Meeting with Expert ${expertId}`, // Optional title
      start: { dateTime: startDateTime.toISOString(), timeZone: "Asia/Kolkata" },
      end: { dateTime: endDateTime.toISOString(), timeZone: "Asia/Kolkata" },
    };

    const calendarResponse = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });

    // Send response back to the client
    res.status(201).json({
      message: "Booking and Google Calendar event created successfully",
      booking,
      googleEventId: calendarResponse.data.id,
    });
  } catch (error) {
    console.error("Error creating event or booking:", error);
    res.status(500).json({ error: "Failed to create event or booking.", details: error.message });
  }
};
