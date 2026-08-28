const { Customer, EwasteRequest } = require("../models");
const bcrypt = require("bcryptjs");

// Get all customers
exports.getAllCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.findAll({
      attributes: { exclude: ["password"] },
      order: [["customerID", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Customers fetched successfully",
      data: customers,
    });
  } catch (error) {
    next(error);
  }
};

// Get customer by ID
exports.getCustomerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id, {
      attributes: { exclude: ["password"] },
      include: [{ model: EwasteRequest, as: "EwasteRequests" }],
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Customer profile fetched successfully",
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

// Update customer
exports.updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { customerName, phoneNo, address, password } = req.body;

    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    if (customerName) customer.customerName = customerName;
    if (phoneNo) customer.phoneNo = phoneNo;
    if (address) customer.address = address;

    if (password) {
      customer.password = await bcrypt.hash(password, 10);
    }

    await customer.save();

    const customerData = customer.toJSON();
    delete customerData.password;

    res.status(200).json({
      success: true,
      message: "Customer profile updated successfully",
      data: customerData,
    });
  } catch (error) {
    next(error);
  }
};

// Delete customer
exports.deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    await customer.destroy();

    res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
