const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const User = sequelize.define("users", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true, // Add unique constraint to email field
  },
  password: Sequelize.STRING,
  isPremiumUser: Sequelize.BOOLEAN,
  totalExpenses: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
});

module.exports = User;