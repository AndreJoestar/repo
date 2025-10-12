const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Payment = sequelize.define('Payment', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  debt_id: { type: DataTypes.BIGINT, allowNull: false },
  amount: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  paid_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'payments',
  timestamps: false
});

module.exports = Payment;
