const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/", authMiddleware, roleMiddleware("ADMIN"), customerController.getAllCustomers);
router.get("/:id", authMiddleware, customerController.getCustomerById);
router.put("/:id", authMiddleware, customerController.updateCustomer);
router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), customerController.deleteCustomer);

module.exports = router;
