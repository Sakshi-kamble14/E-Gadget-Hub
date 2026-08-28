const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CollectionPoint = sequelize.define(
  "CollectionPoint",
  {
    collectionPointID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1000,
    },
    adminID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "collection_points",
    timestamps: true,
  }
);

module.exports = CollectionPoint;
