const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");
const Expense = require("../models/expenseModel");
const { Op } = require("sequelize");

// Controller function to render the reports page
const getReportsPage = (req, res, next) => {
  // Serve the HTML file for the reports page
  res.sendFile(path.join(__dirname, "../", "public", "html", "report.html"));
};


// Controller function to get daily expense reports
const dailyReports = async (req, res, next) => {
  try {
    const date = req.body.date; // Extract the requested date from the request body

    // Find all expenses for the specified date and the current user
    const expenses = await Expense.findAll({
      where: { date: date, userId: req.user.id },
    });

    // Send the list of expenses as the response
    return res.send(expenses);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

// Controller function to get monthly expense reports
const monthlyReports = async (req, res, next) => {
  try {
    const month = req.body.month; // Extract the requested month from the request body

    // Find all expenses for the specified month and the current user
    const expenses = await Expense.findAll({
      where: {
        date: {
          [Op.like]: `%-${month}-%`, // Use Sequelize's Op.like to match the month in the date
        },
        userId: req.user.id,
      },
      raw: true, // Return raw data instead of Sequelize instances
    });

    // Send the list of expenses as the response
    return res.send(expenses);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

// Controller function to download expense reports in CSV format
const downloadReport = async (req, res, next) => {
  try {
    const userId = req.user.id; // Get the user's ID from the request
    const expenses = await Expense.findAll({
      where: { userId: userId },
    });

    // Convert the expenses data to CSV format
    const csvData = [];
    csvData.push(["Date", "Category", "Description", "Amount"]); // CSV header

    expenses.forEach((expense) => {
      csvData.push([
        expense.date,
        expense.category,
        expense.description,
        expense.amount,
      ]);
    });

    // Define the file path
    const filePath = path.join(__dirname, "../", "public", "downloads", "expenses.csv");

    // Ensure the directory structure exists, and then create the file
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    await fs.promises.writeFile(filePath, csvData.map(row => row.join(",")).join("\n"));

    // Set the response headers for CSV download
    res.setHeader("Content-Disposition", `attachment; filename="expenses.csv"`);
    res.setHeader("Content-Type", "text/csv");
    
    // Pipe the CSV file to the response
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);

  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};


module.exports = {
  getReportsPage,
  dailyReports,
  monthlyReports,
  downloadReport, // Add the new controller function
};
