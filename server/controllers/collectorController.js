const { Collector, CollectionPoint, EwasteRequest, Inventory, Customer } = require("../models");

// Get all collectors
exports.getAllCollectors = async (req, res, next) => {
  try {
    const collectors = await Collector.findAll({
      attributes: { exclude: ["password"] },
      include: [{ model: CollectionPoint, as: "CollectionPoint" }],
      order: [["collectorID", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Collectors fetched successfully",
      data: collectors,
    });
  } catch (error) {
    next(error);
  }
};

// Get collector by ID
exports.getCollectorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const collector = await Collector.findByPk(id, {
      attributes: { exclude: ["password"] },
      include: [
        { model: CollectionPoint, as: "CollectionPoint" },
        { model: EwasteRequest, as: "EwasteRequests" },
        { model: Inventory, as: "Inventories" },
      ],
    });

    if (!collector) {
      return res.status(404).json({
        success: false,
        message: "Collector not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Collector details fetched successfully",
      data: collector,
    });
  } catch (error) {
    next(error);
  }
};

// Assign/Update collection point for collector
exports.updateCollectionPoint = async (req, res, next) => {
  try {
    const { collectorId, pointId } = req.params;

    const collector = await Collector.findByPk(collectorId);
    if (!collector) {
      return res.status(404).json({
        success: false,
        message: "Collector not found",
      });
    }

    const point = await CollectionPoint.findByPk(pointId);
    if (!point) {
      return res.status(404).json({
        success: false,
        message: "Collection Point not found",
      });
    }

    collector.collectionPointID = pointId;
    await collector.save();

    const collectorData = collector.toJSON();
    delete collectorData.password;

    res.status(200).json({
      success: true,
      message: "Collector collection point updated successfully",
      data: collectorData,
    });
  } catch (error) {
    next(error);
  }
};

// Get requests assigned to a collector
exports.getCollectorRequests = async (req, res, next) => {
  try {
    const { collectorId } = req.params;

    const requests = await EwasteRequest.findAll({
      where: { collectorID: collectorId },
      include: [
        { model: Customer, as: "Customer", attributes: ["customerID", "customerName", "phoneNo", "address", "email"] },
        { model: CollectionPoint, as: "CollectionPoint" },
      ],
      order: [["requestID", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Collector requests fetched successfully",
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};
