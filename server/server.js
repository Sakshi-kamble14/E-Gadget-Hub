const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { sequelize } = require("./models");
const errorMiddleware = require("./middleware/errorMiddleware");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const collectorRoutes = require("./routes/collectorRoutes");
const requestRoutes = require("./routes/requestRoutes");
const collectionPointRoutes = require("./routes/collectionPointRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Healthcheck Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "E-Waste Management System API is running smoothly.",
  });
});

// Register API Routes
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/collectors", collectorRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/collection-points", collectionPointRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/admin", adminRoutes);

// Centralized Error Handling Middleware
app.use(errorMiddleware);

// Initialize Database & Start Server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL Database Connection established successfully.");

    // Sync database models (creates tables if missing)
    await sequelize.sync({ alter: false });
    console.log("Sequelize Models synchronized with Database.");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to MySQL database:", error.message);
    console.log("Note: Server can start when MySQL service is running.");
    
    // Start HTTP server anyway to avoid process exit if DB isn't started yet during setup
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT} (Database pending connection)`);
    });
  }
};

startServer();
