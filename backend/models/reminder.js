const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Reminder = sequelize.define('Reminder', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.BIGINT, allowNull: false },
  debt_id: { type: DataTypes.BIGINT, allowNull: false },
  remind_at: { type: DataTypes.DATE, allowNull: false },
  sent_flag: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'reminders',
  timestamps: false
});

module.exports = Reminder;
