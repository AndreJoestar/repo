const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Debt = sequelize.define('Debt', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.BIGINT, allowNull: false },
  name: { type: DataTypes.STRING(200), allowNull: false },
  amount: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  due_date: { type: DataTypes.DATEONLY, allowNull: false },
  status: { type: DataTypes.ENUM('pending','paid','cancelled'), defaultValue: 'pending' },
}, {
  tableName: 'debts',
  timestamps: false
});

module.exports = Debt;
