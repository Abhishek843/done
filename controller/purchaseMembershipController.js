const Razorpay = require("razorpay");
const Order = require("../models/orderModel"); // Import the Order model
const userController = require("./userController"); // Import the userController for token generation

require('dotenv').config();

// Retrieve Razorpay API credentials from environment variables
const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

// Controller function to handle the purchase of a premium membership
const purchasePremium = async (req, res) => {
  try {
    // Create a new Razorpay instance with API credentials
    var rzp = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    });

    // Define the amount for the premium membership (in this case, 50000 INR)
    const amount = 5000;

    // Create a Razorpay order with the specified amount and currency
    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      }
      
      // Create a new order record in the database associated with the user
      req.user
        .createOrder({ orderid: order.id, status: "PENDING" }) // Associate the order with the user
        .then(() => {
          // Return a success response with order details and Razorpay key ID
          return res.status(201).json({ order, key_id: rzp.key_id });
        })
        .catch((err) => {
          throw new Error(err);
        });
    });
  } catch (err) {
    console.error("Error creating Razorpay object:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller function to update the transaction status for a premium membership purchase
const updateTransactionStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { payment_id, order_id } = req.body;
    
    // Find the corresponding order in the database based on the order ID
    const order = await Order.findOne({ where: { orderid: order_id } });
    
    // Update the order with the payment ID and set the status to "SUCCESSFUL"
    const promise1 = order.update({
      paymentid: payment_id,
      status: "SUCCESSFUL",
    });
    
    // Update the user's status to indicate they are a premium user
    const promise2 = req.user.update({ isPremiumUser: true });

    // Wait for both promises to resolve
    Promise.all([promise1, promise2])
      .then(() => {
        // Return a success response with a new access token
        return res.status(202).json({
          success: true,
          message: "Transaction Successful",
          token: userController.generateAccessToken(userId, undefined, true), // Generate a new access token with premium status
        });
      })
      .catch((error) => {
        throw new Error(error);
      });
  } catch (err) {
    console.log(err);
    res.status(403).json({ error: err, message: "Something went wrong" });
  }
};

module.exports = {
  purchasePremium,
  updateTransactionStatus
};