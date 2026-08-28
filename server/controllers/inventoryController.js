const { Inventory, Collector, CollectionPoint } = require("../models");

// Create Inventory Item
exports.createInventory = async (req, res, next) => {
  try {
    const { ewasteType, quantity, status, collectionPointID, collectorID } = req.body;

    if (!ewasteType || !collectionPointID) {
      return res.status(400).json({
        success: false,
        message: "E-waste type and Collection Point ID are required.",
      });
    }

    if (quantity !== undefined && Number(quantity) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0.",
      });
    }

    const collectionPoint = await CollectionPoint.findByPk(collectionPointID);
    if (!collectionPoint) {
      return res.status(404).json({
        success: false,
        message: "Collection Point not found.",
      });
    }

    const activeCollectorId = collectorID || (req.user?.role === "COLLECTOR" ? req.user.id : null);

    const inventory = await Inventory.create({
      ewasteType,
      quantity: quantity ? Number(quantity) : 1,
      status: status || "COLLECTED",
      collectorID: activeCollectorId,
      collectionPointID,
    });

    const createdInventory = await Inventory.findByPk(inventory.inventoryID, {
      include: [
        { model: Collector, as: "Collector", attributes: ["collectorID", "collectorName", "email"] },
        { model: CollectionPoint, as: "CollectionPoint" },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Inventory item added successfully",
      data: createdInventory,
    });
  } catch (error) {
    next(error);
  }
};

// Get all Inventory items
exports.getAllInventory = async (req, res, next) => {
  try {
    const inventory = await Inventory.findAll({
      include: [
        { model: Collector, as: "Collector", attributes: ["collectorID", "collectorName", "email"] },
        { model: CollectionPoint, as: "CollectionPoint" },
      ],
      order: [["inventoryID", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Inventory items fetched successfully",
      data: inventory,
    });
  } catch (error) {
    next(error);
  }
};

// Get Inventory item by ID
exports.getInventoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const item = await Inventory.findByPk(id, {
      include: [
        { model: Collector, as: "Collector", attributes: ["collectorID", "collectorName", "email"] },
        { model: CollectionPoint, as: "CollectionPoint" },
      ],
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Inventory item details fetched successfully",
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// Get Inventory items by Collector ID
exports.getInventoryByCollector = async (req, res, next) => {
  try {
    const { collectorId } = req.params;

    const inventory = await Inventory.findAll({
      where: { collectorID: collectorId },
      include: [{ model: CollectionPoint, as: "CollectionPoint" }],
      order: [["inventoryID", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Collector inventory fetched successfully",
      data: inventory,
    });
  } catch (error) {
    next(error);
  }
};

// Update Inventory item (ewasteType, quantity, status, collectionPointID)
exports.updateInventory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { ewasteType, quantity, status, collectionPointID } = req.body;

    const item = await Inventory.findByPk(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    if (quantity !== undefined && Number(quantity) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0.",
      });
    }

    const validStatuses = ["AVAILABLE", "COLLECTED", "PROCESSED", "RECYCLED"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    if (ewasteType) item.ewasteType = ewasteType;
    if (quantity !== undefined) item.quantity = Number(quantity);
    if (status) item.status = status;
    if (collectionPointID) item.collectionPointID = collectionPointID;

    await item.save();

    const updatedItem = await Inventory.findByPk(id, {
      include: [
        { model: Collector, as: "Collector", attributes: ["collectorID", "collectorName", "email"] },
        { model: CollectionPoint, as: "CollectionPoint" },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Inventory item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Inventory item
exports.deleteInventory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const item = await Inventory.findByPk(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    await item.destroy();

    res.status(200).json({
      success: true,
      message: "Inventory item deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
