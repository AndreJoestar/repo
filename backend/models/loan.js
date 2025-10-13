const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Loan = sequelize.define('Loan', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.BIGINT, allowNull: false },
  name: { type: DataTypes.STRING(200), allowNull: false },
  principal_amount: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  interest_rate: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
  total_installments: { type: DataTypes.INTEGER, allowNull: true },
  start_date: { type: DataTypes.DATEONLY, allowNull: true },
  notes: { type: DataTypes.TEXT, allowNull: true }
}, {
  tableName: 'loans',
  timestamps: false
});

module.exports = Loan;
