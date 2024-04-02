'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Inventory extends Model {

    static associate(models) {
      Inventory.belongsTo(models.User, {
        foreignKey: 'userId'
      });
      Inventory.belongsTo(models.Stat, {
        foreignKey: 'statId'
      });
    }
  }
  Inventory.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    itemName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 50]
      }
    },
    statId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Stats',
        key: 'id'
      },
    },
    itemType: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    healthBoost: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    statBoost: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    gear: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    wep: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    equipped: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [10, 250]
      },
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Inventory',
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    }
  });
  return Inventory;
};
