// Import the Express framework for building web applications.
const express = require("express");

// Create a new router instance to define routes for this module.
const router = express.Router();

// Import the expense controller that contains route handling logic.
const expenseController = require("../controller/expenseController");

// Import the user authentication middleware.
const userAuthentication = require("../authentication/auth");

// Serve static files from the "public" directory.
router.use(express.static("public"));

// Define routes and their associated handlers.

// Route for displaying the home page.
router.get("/", expenseController.getHomePage);

//Route for retrieving all expenses.
router.get(
  "/getAllExpenses",
  userAuthentication, // Middleware to authenticate the user
  expenseController.getAllExpenses // Handler to get all expenses
);
router.get(
  "/getAllExpenses/:page",
  userAuthentication,
  expenseController.getAllExpensesforPagination
);

// Route for deleting an expense by ID.
router.get(
  "/deleteExpense/:id",
  userAuthentication, // Middleware to authenticate the user
  expenseController.deleteExpense // Handler to delete an expense
);

// Route for adding a new expense.
router.post(
  "/addExpense",
  userAuthentication, // Middleware to authenticate the user
  expenseController.addExpense // Handler to add a new expense
);

// Route for editing an expense by ID.
router.post(
  "/editExpense/:id",
  userAuthentication, // Middleware to authenticate the user
  expenseController.editExpense // Handler to edit an expense
);

// Export the router to make it available for use in other parts of the application.
module.exports = router;
