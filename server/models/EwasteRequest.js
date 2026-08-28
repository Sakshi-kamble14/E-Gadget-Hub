const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const EwasteRequest = sequelize.define(
  "EwasteRequest",
  {
    requestID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.ENUM("PENDING", "ASSIGNED", "COLLECTED", "COMPLETED", "CANCELLED"),
      allowNull: false,
      defaultValue: "PENDING",
    },
    customerID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    collectorID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    collectionPointID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "ewaste_requests",
    timestamps: true,
  }
);

module.exports = EwasteRequest;
