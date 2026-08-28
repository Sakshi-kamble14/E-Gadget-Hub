const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Admin routes with protection
router.get("/dashboard", authMiddleware, roleMiddleware("ADMIN"), adminController.getDashboardStats);
router.get("/customers", authMiddleware, roleMiddleware("ADMIN"), adminController.getAdminCustomers);
router.get("/collectors", authMiddleware, roleMiddleware("ADMIN"), adminController.getAdminCollectors);
router.get("/requests", authMiddleware, roleMiddleware("ADMIN"), adminController.getAdminRequests);
router.get("/inventory", authMiddleware, roleMiddleware("ADMIN"), adminController.getAdminInventory);

module.exports = router;
