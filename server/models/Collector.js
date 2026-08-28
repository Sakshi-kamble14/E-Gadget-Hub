const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Collector = sequelize.define(
  "Collector",
  {
    collectorID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    collectorName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    collectionPointID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "collectors",
    timestamps: true,
  }
);

module.exports = Collector;
