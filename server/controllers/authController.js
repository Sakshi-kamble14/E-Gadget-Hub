const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Customer, Collector, Admin, CollectionPoint } = require("../models");

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || "ewaste_jwt_secret_key_2026_super_secure", {
    expiresIn: "7d",
  });
};

// Customer Register
exports.customerRegister = async (req, res, next) => {
  try {
    const { customerName, email, phoneNo, password, address } = req.body;

    if (!customerName || !email || !phoneNo || !password || !address) {
      return res.status(400).json({
        success: false,
        message: "All customer fields are required.",
      });
    }

    const existingCustomer = await Customer.findOne({ where: { email } });
    if (existingCustomer) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = await Customer.create({
      customerName,
      email,
      phoneNo,
      password: hashedPassword,
      address,
    });

    const token = generateToken({
      id: customer.customerID,
      role: "CUSTOMER",
      email: customer.email,
    });

    const customerData = customer.toJSON();
    delete customerData.password;

    res.status(201).json({
      success: true,
      message: "Customer registered successfully",
      data: {
        token,
        user: customerData,
        role: "CUSTOMER",
      },
    });
  } catch (error) {
    next(error);
  }
};

// Customer Login
exports.customerLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const customer = await Customer.findOne({ where: { email } });
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = generateToken({
      id: customer.customerID,
      role: "CUSTOMER",
      email: customer.email,
    });

    const customerData = customer.toJSON();
    delete customerData.password;

    res.status(200).json({
      success: true,
      message: "Customer login successful",
      data: {
        token,
        user: customerData,
        role: "CUSTOMER",
      },
    });
  } catch (error) {
    next(error);
  }
};

// Collector Register
exports.collectorRegister = async (req, res, next) => {
  try {
    const { collectorName, email, password, collectionPointID } = req.body;

    if (!collectorName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Collector name, email, and password are required.",
      });
    }

    const existingCollector = await Collector.findOne({ where: { email } });
    if (existingCollector) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const collector = await Collector.create({
      collectorName,
      email,
      password: hashedPassword,
      collectionPointID: collectionPointID || null,
    });

    const token = generateToken({
      id: collector.collectorID,
      role: "COLLECTOR",
      email: collector.email,
    });

    const collectorData = collector.toJSON();
    delete collectorData.password;

    res.status(201).json({
      success: true,
      message: "Collector registered successfully",
      data: {
        token,
        user: collectorData,
        role: "COLLECTOR",
      },
    });
  } catch (error) {
    next(error);
  }
};

// Collector Login
exports.collectorLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const collector = await Collector.findOne({
      where: { email },
      include: [{ model: CollectionPoint, as: "CollectionPoint" }],
    });

    if (!collector) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, collector.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = generateToken({
      id: collector.collectorID,
      role: "COLLECTOR",
      email: collector.email,
    });

    const collectorData = collector.toJSON();
    delete collectorData.password;

    res.status(200).json({
      success: true,
      message: "Collector login successful",
      data: {
        token,
        user: collectorData,
        role: "COLLECTOR",
      },
    });
  } catch (error) {
    next(error);
  }
};

// Admin Register
exports.adminRegister = async (req, res, next) => {
  try {
    const { adminName, email, password } = req.body;

    if (!adminName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Admin name, email, and password are required.",
      });
    }

    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      adminName,
      email,
      password: hashedPassword,
    });

    const token = generateToken({
      id: admin.adminID,
      role: "ADMIN",
      email: admin.email,
    });

    const adminData = admin.toJSON();
    delete adminData.password;

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: {
        token,
        user: adminData,
        role: "ADMIN",
      },
    });
  } catch (error) {
    next(error);
  }
};

// Admin Login
exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = generateToken({
      id: admin.adminID,
      role: "ADMIN",
      email: admin.email,
    });

    const adminData = admin.toJSON();
    delete adminData.password;

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      data: {
        token,
        user: adminData,
        role: "ADMIN",
      },
    });
  } catch (error) {
    next(error);
  }
};
