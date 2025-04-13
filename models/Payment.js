const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
  order_id: { type: DataTypes.INTEGER, allowNull: false },
  method: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'unpaid' },
  transaction_id: { type: DataTypes.STRING },
});

module.exports = Payment;
