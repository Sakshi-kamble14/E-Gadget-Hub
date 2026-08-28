const express = require("express");
const router = express.Router();
const requestController = require("../controllers/requestController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Customer submits request
router.post("/", authMiddleware, requestController.createRequest);

// Get requests by customer ID
router.get("/customer/:customerId", authMiddleware, requestController.getRequestsByCustomer);

// Get requests by collector ID
router.get("/collector/:collectorId", authMiddleware, requestController.getRequestsByCollector);

// Admin assigns collector
router.put(
  "/:requestId/assign/:collectorId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  requestController.assignCollector
);

// Collector or Admin updates status
router.put("/:requestId/status", authMiddleware, requestController.updateRequestStatus);

// Get all requests
router.get("/", authMiddleware, requestController.getAllRequests);

// Get single request
router.get("/:id", authMiddleware, requestController.getRequestById);

// Delete request
router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), requestController.deleteRequest);

module.exports = router;
