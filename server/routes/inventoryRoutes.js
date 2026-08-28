const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Collector or Admin creates inventory
router.post(
  "/",
  authMiddleware,
  roleMiddleware("COLLECTOR", "ADMIN"),
  inventoryController.createInventory
);

// Get all inventory items
router.get("/", authMiddleware, inventoryController.getAllInventory);

// Get inventory items for collector
router.get("/collector/:collectorId", authMiddleware, inventoryController.getInventoryByCollector);

// Get single inventory item
router.get("/:id", authMiddleware, inventoryController.getInventoryById);

// Update inventory item
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("COLLECTOR", "ADMIN"),
  inventoryController.updateInventory
);

// Delete inventory item
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  inventoryController.deleteInventory
);

module.exports = router;
