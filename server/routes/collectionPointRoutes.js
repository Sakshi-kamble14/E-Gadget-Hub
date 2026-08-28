const express = require("express");
const router = express.Router();
const collectionPointController = require("../controllers/collectionPointController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Open or authenticated listing
router.get("/", collectionPointController.getAllCollectionPoints);
router.get("/:id", collectionPointController.getCollectionPointById);

// Admin restricted modifications
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  collectionPointController.createCollectionPoint
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  collectionPointController.updateCollectionPoint
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  collectionPointController.deleteCollectionPoint
);

module.exports = router;
