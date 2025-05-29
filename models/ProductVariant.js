const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductVariant = sequelize.define('ProductVariant', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
    validate: { len: [3, 50] },
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0 },
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 0 },
  },
}, {
  tableName: 'ProductVariants',
  timestamps: true,
});

module.exports = ProductVariant;