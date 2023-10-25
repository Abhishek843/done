const path = require("path");
const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const sequelize = require("../util/database");

// Controller function to render the home page
const getHomePage = (req, res, next) => {
  // Serve the HTML file for the home page
  res.sendFile(path.join(__dirname, "../", "public", "html", "homePage.html"));
};

// Controller function to add an expense
const addExpense = async (req, res, next) => {
  const { date, category, description, amount } = req.body;
  let t; // Declare the transaction variable

  try {
    t = await sequelize.transaction(); // Create a new transaction

    // Increment totalExpenses for the user
    await User.increment('totalExpenses', {
      by: amount,
      where: { id: req.user.id },
      transaction: t,
    });

    // Create a new expense record
    await Expense.create({
      date: date,
      category: category,
      description: description,
      amount: amount,
      userId: req.user.id,
    }, {
      transaction: t,
    });

    // Commit the transaction if all operations succeed
    await t.commit();

    // Redirect to the home page after adding the expense
    res.redirect("/homePage");
  } catch (err) {
    console.error(err);

    if (t) {
      // Rollback the transaction if an error occurs
      await t.rollback();
    }

    res.status(500).send("An error occurred while adding the expense.");
  }
};

// Controller function to get all expenses for the current user
const getAllExpenses = async (req, res, next) => {
  try {
    // Fetch all expenses associated with the current user
    const expenses = await Expense.findAll({ where: { userId: req.user.id } });
    
    // Respond with the list of expenses in JSON format
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while fetching expenses.");
  }
};


// Controller function to get expenses for pagination
const getAllExpensesforPagination = async (req, res, next) => {
  try {
    const pageNo = req.params.page;
    const limit = 10;
    const offset = (pageNo - 1) * limit;

    // Count the total number of expenses for the current user
    const totalExpenses = await Expense.count({
      where: { userId: req.user.id },
    });

    // Calculate the total number of pages needed for pagination
    const totalPages = Math.ceil(totalExpenses / limit);

    // Fetch expenses for the current page
    const expenses = await Expense.findAll({
      where: { userId: req.user.id },
      offset: offset,
      limit: limit,
    });

    // Respond with expenses and total page count in JSON format
    res.json({ expenses: expenses, totalPages: totalPages });
  } catch (err) {
    console.log(err);
  }
};

// Controller function to delete an expense
const deleteExpense = async (req, res, next) => {
  let t; // Declare the transaction variable

  try {
    const id = req.params.id;
    const expense = await Expense.findByPk(id);

    t = await sequelize.transaction(); // Create a new transaction

    // Decrement totalExpenses for the user
    await User.decrement('totalExpenses', {
      by: expense.amount,
      where: { id: req.user.id },
      transaction: t,
    });

    // Delete the expense
    await Expense.destroy({ where: { id: id, userId: req.user.id }, transaction: t });

    // Commit the transaction if all operations succeed
    await t.commit();

    // Redirect to the home page after deleting the expense
    res.redirect("/homePage");
  } catch (err) {
    console.error(err);

    if (t) {
      // Rollback the transaction if an error occurs
      await t.rollback();
    }

    res.status(500).send("An error occurred while deleting the expense.");
  }
};

// Controller function to edit an expense
const editExpense = async (req, res, next) => {
  let t; // Declare the transaction variable

  try {
    const id = req.params.id;
    const { category, description, amount } = req.body;

    const expense = await Expense.findByPk(id);
    const amountDifference = amount - expense.amount;

    t = await sequelize.transaction(); // Create a new transaction

    // Increment or decrement totalExpenses for the user based on the amount difference
    await User.increment('totalExpenses', {
      by: amountDifference,
      where: { id: req.user.id },
      transaction: t,
    });

    // Update the expense
    await Expense.update(
      {
        category: category,
        description: description,
        amount: amount,
      },
      { where: { id: id, userId: req.user.id }, transaction: t }
    );

    // Commit the transaction if all operations succeed
    await t.commit();

    // Redirect to the home page after editing the expense
    res.redirect("/homePage");
  } catch (err) {
    console.error(err);

    if (t) {
      // Rollback the transaction if an error occurs
      await t.rollback();
    }

    res.status(500).send("An error occurred while editing the expense.");
  }
};

module.exports = {
  getHomePage,
  addExpense,
  getAllExpenses,
  getAllExpensesforPagination,
  deleteExpense,
  editExpense,
};
