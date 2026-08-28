const { EwasteRequest, Customer, Collector, CollectionPoint } = require("../models");

// Customer submits e-waste request
exports.createRequest = async (req, res, next) => {
  try {
    const { collectionPointID, customerID } = req.body;
    const activeCustomerId = customerID || req.user?.id;

    if (!activeCustomerId || !collectionPointID) {
      return res.status(400).json({
        success: false,
        message: "Customer ID and Collection Point ID are required.",
      });
    }

    const collectionPoint = await CollectionPoint.findByPk(collectionPointID);
    if (!collectionPoint) {
      return res.status(404).json({
        success: false,
        message: "Selected Collection Point does not exist.",
      });
    }

    const request = await EwasteRequest.create({
      customerID: activeCustomerId,
      collectionPointID,
      status: "PENDING",
    });

    const createdRequest = await EwasteRequest.findByPk(request.requestID, {
      include: [
        { model: Customer, as: "Customer", attributes: ["customerID", "customerName", "phoneNo", "email", "address"] },
        { model: CollectionPoint, as: "CollectionPoint" },
      ],
    });

    res.status(201).json({
      success: true,
      message: "E-waste request submitted successfully",
      data: createdRequest,
    });
  } catch (error) {
    next(error);
  }
};

// Get all requests
exports.getAllRequests = async (req, res, next) => {
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
      message: "Requests fetched successfully",
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// Get request by ID
exports.getRequestById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const request = await EwasteRequest.findByPk(id, {
      include: [
        { model: Customer, as: "Customer", attributes: ["customerID", "customerName", "phoneNo", "email", "address"] },
        { model: Collector, as: "Collector", attributes: ["collectorID", "collectorName", "email"] },
        { model: CollectionPoint, as: "CollectionPoint" },
      ],
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "E-waste request not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "E-waste request details fetched successfully",
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// Get requests by Customer ID
exports.getRequestsByCustomer = async (req, res, next) => {
  try {
    const { customerId } = req.params;

    const requests = await EwasteRequest.findAll({
      where: { customerID: customerId },
      include: [
        { model: Collector, as: "Collector", attributes: ["collectorID", "collectorName", "email"] },
        { model: CollectionPoint, as: "CollectionPoint" },
      ],
      order: [["requestID", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Customer requests fetched successfully",
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// Get requests by Collector ID
exports.getRequestsByCollector = async (req, res, next) => {
  try {
    const { collectorId } = req.params;

    const requests = await EwasteRequest.findAll({
      where: { collectorID: collectorId },
      include: [
        { model: Customer, as: "Customer", attributes: ["customerID", "customerName", "phoneNo", "email", "address"] },
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

// Admin assigns a collector to request
exports.assignCollector = async (req, res, next) => {
  try {
    const { requestId, collectorId } = req.params;

    const request = await EwasteRequest.findByPk(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "E-waste request not found",
      });
    }

    const collector = await Collector.findByPk(collectorId);
    if (!collector) {
      return res.status(404).json({
        success: false,
        message: "Collector not found",
      });
    }

    request.collectorID = collectorId;
    request.status = "ASSIGNED";
    await request.save();

    const updatedRequest = await EwasteRequest.findByPk(requestId, {
      include: [
        { model: Customer, as: "Customer", attributes: ["customerID", "customerName", "phoneNo", "email"] },
        { model: Collector, as: "Collector", attributes: ["collectorID", "collectorName", "email"] },
        { model: CollectionPoint, as: "CollectionPoint" },
      ],
    });

    res.status(200).json({
      success: true,
      message: `Collector ${collector.collectorName} assigned to Request #${requestId}`,
      data: updatedRequest,
    });
  } catch (error) {
    next(error);
  }
};

// Update request status (PENDING, ASSIGNED, COLLECTED, COMPLETED, CANCELLED)
exports.updateRequestStatus = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    const validStatuses = ["PENDING", "ASSIGNED", "COLLECTED", "COMPLETED", "CANCELLED"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const request = await EwasteRequest.findByPk(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "E-waste request not found",
      });
    }

    request.status = status;
    await request.save();

    const updatedRequest = await EwasteRequest.findByPk(requestId, {
      include: [
        { model: Customer, as: "Customer", attributes: ["customerID", "customerName", "phoneNo", "email"] },
        { model: Collector, as: "Collector", attributes: ["collectorID", "collectorName", "email"] },
        { model: CollectionPoint, as: "CollectionPoint" },
      ],
    });

    res.status(200).json({
      success: true,
      message: `Request #${requestId} status updated to ${status}`,
      data: updatedRequest,
    });
  } catch (error) {
    next(error);
  }
};

// Delete request
exports.deleteRequest = async (req, res, next) => {
  try {
    const { id } = req.params;

    const request = await EwasteRequest.findByPk(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "E-waste request not found",
      });
    }

    await request.destroy();

    res.status(200).json({
      success: true,
      message: "E-waste request deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
