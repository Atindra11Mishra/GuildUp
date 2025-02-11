const { google } = require("googleapis");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const credentialsPath = path.join(__dirname, "../credentials.json");

const auth = new google.auth.GoogleAuth({
  keyFile: credentialsPath,
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

const calendar = google.calendar({ version: "v3", auth });

module.exports = { calendar };
