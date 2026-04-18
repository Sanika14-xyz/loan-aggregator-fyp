const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load env variables and connect to database
dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/loans", require("./routes/loanRoutes"));
app.use("/api/banks", require("./routes/bankRoutes"));
app.use("/api/recommend", require("./routes/recommendationRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));
app.use("/api/chat", require("./routes/chatRoutes")); // <-- New AI Chatbot route

// Base route for testing
app.get("/", (req, res) => {
  res.send("Credify Backend running 🚀");
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// Start Server
// Adding '0.0.0.0' tells the server to listen to all devices on the network
app.listen(5000, '0.0.0.0', () => {
  console.log("Server running on port 5000 - Open to Mobile Devices");
});