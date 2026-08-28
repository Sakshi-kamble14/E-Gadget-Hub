const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Inventory = sequelize.define(
  "Inventory",
  {
    inventoryID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ewasteType: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },
    status: {
      type: DataTypes.ENUM("AVAILABLE", "COLLECTED", "PROCESSED", "RECYCLED"),
      allowNull: false,
      defaultValue: "COLLECTED",
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
    tableName: "inventory",
    timestamps: true,
  }
);

module.exports = Inventory;
