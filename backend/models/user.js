const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const User = sequelize.define('User', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(120) },
  email: { type: DataTypes.STRING(200), unique: true, allowNull: false },
  password: { type: DataTypes.STRING(255), allowNull: false },
}, {
  tableName: 'users',
  timestamps: false
});

User.prototype.verifyPassword = function(password) {
  return password === this.password;
};

module.exports = User;
