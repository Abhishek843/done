// Import the Express framework for building web applications.
const express = require("express");

// Create a new router instance to define routes for this module.
const router = express.Router();

// Import the user controller that contains route handling logic.
const userController = require("../controller/userController");

// Import the user authentication middleware.
const userAuthentication = require("../authentication/auth");

// Serve static files from the "public" directory.
router.use(express.static("public"));

// Define routes and their associated handlers.

// Route for displaying the login page.
router.get("/", userController.getLoginPage);

// Route for checking if a user is a premium user.
router.get("/isPremiumUser", userAuthentication, userController.isPremiumUser);

// Route for handling user login.
router.post("/login", userController.postUserLogin);

// Route for handling user sign-up.
router.post("/signUp", userController.postUserSignUp);


// Export the router to make it available for use in other parts of the application.
module.exports = router;