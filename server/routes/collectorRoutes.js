const express = require("express");
const router = express.Router();
const collectorController = require("../controllers/collectorController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/", authMiddleware, collectorController.getAllCollectors);
router.get("/:id", authMiddleware, collectorController.getCollectorById);
router.put(
  "/:collectorId/collection-point/:pointId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  collectorController.updateCollectionPoint
);
router.get("/:collectorId/requests", authMiddleware, collectorController.getCollectorRequests);

module.exports = router;
