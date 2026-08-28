const sequelize = require("../config/database");
const Customer = require("./Customer");
const Admin = require("./Admin");
const Collector = require("./Collector");
const CollectionPoint = require("./CollectionPoint");
const EwasteRequest = require("./EwasteRequest");
const Inventory = require("./Inventory");

// Associations as specified in Class Diagram & Prompt
Customer.hasMany(EwasteRequest, { foreignKey: "customerID" });
EwasteRequest.belongsTo(Customer, { foreignKey: "customerID" });

Collector.hasMany(EwasteRequest, { foreignKey: "collectorID" });
EwasteRequest.belongsTo(Collector, { foreignKey: "collectorID" });

CollectionPoint.hasMany(EwasteRequest, { foreignKey: "collectionPointID" });
EwasteRequest.belongsTo(CollectionPoint, { foreignKey: "collectionPointID" });

Admin.hasMany(CollectionPoint, { foreignKey: "adminID" });
CollectionPoint.belongsTo(Admin, { foreignKey: "adminID" });

CollectionPoint.hasMany(Collector, { foreignKey: "collectionPointID" });
Collector.belongsTo(CollectionPoint, { foreignKey: "collectionPointID" });

Collector.hasMany(Inventory, { foreignKey: "collectorID" });
Inventory.belongsTo(Collector, { foreignKey: "collectorID" });

CollectionPoint.hasMany(Inventory, { foreignKey: "collectionPointID" });
Inventory.belongsTo(CollectionPoint, { foreignKey: "collectionPointID" });

module.exports = {
  sequelize,
  Customer,
  Admin,
  Collector,
  CollectionPoint,
  EwasteRequest,
  Inventory,
};
