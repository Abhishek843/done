// Import the Express framework for building web applications.

const express = require("express");
const app = express();

const path = require("path");
const fs = require("fs");
const helmet = require("helmet");
const morgan = require("morgan");
const https = require("https");

require('dotenv').config(); // Load environment variables from .env file


// Import the body-parser middleware for parsing HTTP request bodies.
const bodyParser = require("body-parser");

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
app.use(morgan("combined", { stream: accessLogStream }));

// Import the Sequelize instance for connecting to the database.
const sequelize = require("./util/database");

// Import the route handlers for different parts of your application.
const userRouter = require("./routes/userRoutes"); // User-related routes
const expenseRouter = require("./routes/expenseRouter"); // Expense-related routes
const purchaseMembershipRouter = require("./routes/purchaseMembershipRouter"); // Purchase membership related routes
const leaderboardRouter = require("./routes/leaderboardRouter");
const reportsRouter = require("./routes/reportsRouter");

const resetPasswordRouter = require("./routes/password");

// Import the Sequelize models that define your database tables.
const User = require("./models/userModel"); // User model
const Expense = require("./models/expenseModel"); // Expense model
const Order = require("./models/orderModel"); // Order model

const ResetPassword = require("./models/forgotPassword");


const serverKey = fs.readFileSync('server.key');
const serverCert = fs.readFileSync('server.cert');

// Serve static files from the "public" directory.
app.use(express.static("public"));

// Use body-parser middleware to parse incoming JSON and form data.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Define routes for different parts of your application and connect them to route handlers.

// Routes related to user management:
app.use("/", userRouter); // These routes will be accessible at the root URL and "/user".
// app.use("/user", userRouter);

// Routes related to the expense tracker application:
app.use("/homePage", expenseRouter); // These routes will be accessible under "/homePage" for managing expenses.
app.use("/expense", expenseRouter); // These routes will also be accessible under "/expense".

// Routes related to purchasing membership:
app.use("/purchase", purchaseMembershipRouter); // These routes will be accessible under "/purchase".
app.use("/premium", leaderboardRouter);
app.use("/reports", reportsRouter);

app.use("/password", resetPasswordRouter);

app.use((req,res)=>{
  res.sendFile(path.join(__dirname, "./", "public", "html", "user.html"));
})

// Define relationships between database tables using Sequelize associations.
User.hasMany(Expense); // A user can have multiple expenses.
Expense.belongsTo(User); // An expense belongs to a user.

User.hasMany(Order); // A user can have multiple orders (e.g., for premium membership).
Order.belongsTo(User); // An order belongs to a user.

ResetPassword.belongsTo(User);
User.hasMany(ResetPassword);

// Sync the Sequelize models with the database and start the Express application.
sequelize
  .sync() // This method synchronizes the database schema with the defined models.
  // .then((result) => {
  //   https.createServer({key: privateKey , cert: certificate},app)
  //   .listen(process.env.PORT ||3200); // Start the Express app on port 3200.
  // })
  .then((result) => {
    app.listen(process.env.PORT ||3200); // Start the Express app on port 3200.
    console.log("Server Started");
  })
  .catch((err) => console.log(err)); // Handle any errors that occur during synchronization.
