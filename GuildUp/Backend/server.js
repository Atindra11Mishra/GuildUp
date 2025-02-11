const express = require("express");
const dotenv = require("dotenv");
const connectDB= require('./config/db.js')
const path = require("path");
const cors = require("cors");
const calendarRoutes = require("./routes/calendarRoutes");
const paymentRoutes= require('./routes/paymentRoutes.js')
const expertRoutes= require('./routes/expertRoutes.js')

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.use("/api/payment", paymentRoutes);
app.use("/api", expertRoutes);
app.use("/api/calendar", calendarRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
