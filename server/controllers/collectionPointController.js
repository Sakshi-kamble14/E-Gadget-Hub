const { CollectionPoint, Admin, Collector, EwasteRequest } = require("../models");

// Create Collection Point
exports.createCollectionPoint = async (req, res, next) => {
  try {
    const { location, capacity, adminID } = req.body;

    if (!location) {
      return res.status(400).json({
        success: false,
        message: "Location is required.",
      });
    }

    if (capacity !== undefined && capacity < 0) {
      return res.status(400).json({
        success: false,
        message: "Capacity cannot be negative.",
      });
    }

    const point = await CollectionPoint.create({
      location,
      capacity: capacity !== undefined ? capacity : 1000,
      adminID: adminID || req.user?.id || null,
    });

    res.status(201).json({
      success: true,
      message: "Collection Point created successfully",
      data: point,
    });
  } catch (error) {
    next(error);
  }
};

// Get all Collection Points
exports.getAllCollectionPoints = async (req, res, next) => {
  try {
    const points = await CollectionPoint.findAll({
      include: [
        { model: Admin, as: "Admin", attributes: ["adminID", "adminName", "email"] },
        { model: Collector, as: "Collectors", attributes: ["collectorID", "collectorName", "email"] },
      ],
      order: [["collectionPointID", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Collection Points fetched successfully",
      data: points,
    });
  } catch (error) {
    next(error);
  }
};

// Get Collection Point by ID
exports.getCollectionPointById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const point = await CollectionPoint.findByPk(id, {
      include: [
        { model: Admin, as: "Admin", attributes: ["adminID", "adminName", "email"] },
        { model: Collector, as: "Collectors", attributes: ["collectorID", "collectorName", "email"] },
        { model: EwasteRequest, as: "EwasteRequests" },
      ],
    });

    if (!point) {
      return res.status(404).json({
        success: false,
        message: "Collection Point not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Collection Point details fetched successfully",
      data: point,
    });
  } catch (error) {
    next(error);
  }
};

// Update Collection Point
exports.updateCollectionPoint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { location, capacity, adminID } = req.body;

    const point = await CollectionPoint.findByPk(id);
    if (!point) {
      return res.status(404).json({
        success: false,
        message: "Collection Point not found",
      });
    }

    if (capacity !== undefined && capacity < 0) {
      return res.status(400).json({
        success: false,
        message: "Capacity cannot be negative.",
      });
    }

    if (location) point.location = location;
    if (capacity !== undefined) point.capacity = capacity;
    if (adminID !== undefined) point.adminID = adminID;

    await point.save();

    res.status(200).json({
      success: true,
      message: "Collection Point updated successfully",
      data: point,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Collection Point
exports.deleteCollectionPoint = async (req, res, next) => {
  try {
    const { id } = req.params;

    const point = await CollectionPoint.findByPk(id);
    if (!point) {
      return res.status(404).json({
        success: false,
        message: "Collection Point not found",
      });
    }

    await point.destroy();

    res.status(200).json({
      success: true,
      message: "Collection Point deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
