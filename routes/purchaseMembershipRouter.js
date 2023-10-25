// Import the Express framework for building web applications.
const express = require("express");

// Import the purchase membership controller that contains route handling logic.
const purchaseMembershipController = require("../controller/purchaseMembershipController");

// Import the authentication middleware.
const authenticatemiddleware = require("../authentication/auth");

// Create a new router instance to define routes for this module.
const router = express.Router();

// Define routes and their associated handlers.

// Route for purchasing premium membership.
router.get(
  "/premiumMembership",
  authenticatemiddleware, // Middleware to authenticate the user
  purchaseMembershipController.purchasePremium // Handler to process premium membership purchase
);

// Route for updating transaction status (e.g., after payment).
router.post(
  "/updateTransactionStatus",
  authenticatemiddleware, // Middleware to authenticate the user
  purchaseMembershipController.updateTransactionStatus // Handler to update transaction status
);

// Export the router to make it available for use in other parts of the application.
module.exports = router;
