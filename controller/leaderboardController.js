const path = require("path");
const User = require("../models/userModel");
const Expense = require("../models/expenseModel");
const sequelize = require("../util/database");

// Controller function to render the leaderboard page
const getLeaderboardPage = (req, res, next) => {
  // Serve the HTML file for the leaderboard page
  res.sendFile(
    path.join(__dirname, "../", "public", "html", "leaderboard.html")
  );
};

// Controller function to get the leaderboard data
const getLeaderboard = (req, res, next) => {
  // Use Sequelize to query the database and calculate the leaderboard data

  Expense.findAll({
    attributes: [
      // Calculate the total expense for each user and rename it as "totalExpense"
      [sequelize.fn("sum", sequelize.col("amount")), "totalExpense"],
      // Select the "name" attribute from the associated User model and rename it as "name"
      [sequelize.col("user.name"), "name"],
    ],
    group: ["userId"], // Group the results by the "userId" field
    include: [
      {
        model: User, // Include the User model to access user-related data
        attributes: [], // Exclude all attributes from the User model (we only need the association)
      },
    ],
    order: [[sequelize.fn("sum", sequelize.col("amount")), "DESC"]], // Order the results by total expense in descending order
  })
    .then((expenses) => {
      // Map the queried data into a format suitable for the leaderboard
      const result = expenses.map((expense) => ({
        name: expense.getDataValue("name"), // Get the "name" value from the result
        amount: expense.getDataValue("totalExpense"), // Get the "totalExpense" value from the result
      }));

      // Send the leaderboard data as JSON
      res.send(JSON.stringify(result));
    })
    .catch((err) => console.log(err)); // Handle any errors that occur during the query
};

module.exports = {
  getLeaderboardPage,
  getLeaderboard
};