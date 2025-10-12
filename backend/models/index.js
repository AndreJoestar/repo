const sequelize = require('../config/sequelize');
const User = require('./user');
const Debt = require('./debt');
const Payment = require('./payment');
const Reminder = require('./reminder');

module.exports = {
  sequelize,
  User,
  Debt,
  Payment,
  Reminder
};
