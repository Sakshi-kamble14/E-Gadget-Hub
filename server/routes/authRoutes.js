const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Customer Authentication
router.post("/customer/register", authController.customerRegister);
router.post("/customer/login", authController.customerLogin);

// Collector Authentication
router.post("/collector/register", authController.collectorRegister);
router.post("/collector/login", authController.collectorLogin);

// Admin Authentication
router.post("/admin/register", authController.adminRegister);
router.post("/admin/login", authController.adminLogin);

module.exports = router;
