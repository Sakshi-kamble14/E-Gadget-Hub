const { Customer, Collector, CollectionPoint, EwasteRequest, Inventory } = require("../models");

// Admin Dashboard Summary Metrics
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalCustomers = await Customer.count();
    const totalCollectors = await Collector.count();
    const totalCollectionPoints = await CollectionPoint.count();
    const totalRequests = await EwasteRequest.count();
    const pendingRequests = await EwasteRequest.count({ where: { status: "PENDING" } });
    const completedRequests = await EwasteRequest.count({ where: { status: "COMPLETED" } });

    const totalEwasteQuantity = (await Inventory.sum("quantity")) || 0;
    const recycledEwasteQuantity = (await Inventory.sum("quantity", { where: { status: "RECYCLED" } })) || 0;

    res.status(200).json({
      success: true,
      message: "Dashboard statistics calculated successfully",
      data: {
        totalCustomers,
        totalCollectors,
        totalCollectionPoints,
        totalRequests,
        pendingRequests,
        completedRequests,
        totalEwasteQuantity,
        recycledEwasteQuantity,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Admin view all customers
exports.getAdminCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.findAll({
      attributes: { exclude: ["password"] },
      order: [["customerID", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: customers,
    });
  } catch (error) {
    next(error);
  }
};

// Admin view all collectors
exports.getAdminCollectors = async (req, res, next) => {
  try {
    const collectors = await Collector.findAll({
      attributes: { exclude: ["password"] },
      include: [{ model: CollectionPoint, as: "CollectionPoint" }],
      order: [["collectorID", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: collectors,
    });
  } catch (error) {
    next(error);
  }
};

// Admin view all requests
exports.getAdminRequests = async (req, res, next) => {
  try {
    const requests = await EwasteRequest.findAll({
      include: [
        { model: Customer, as: "Customer", attributes: ["customerID", "customerName", "phoneNo", "email", "address"] },
        { model: Collector, as: "Collector", attributes: ["collectorID", "collectorName", "email"] },
        { model: CollectionPoint, as: "CollectionPoint" },
      ],
      order: [["requestID", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// Admin view all inventory
exports.getAdminInventory = async (req, res, next) => {
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
      data: inventory,
    });
  } catch (error) {
    next(error);
  }
};
