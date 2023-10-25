const jwt = require("jsonwebtoken"); // Import the JWT library
const User = require("../models/userModel"); // Import the User model


// Middleware function for user authentication
const authenticate = (req, res, next) => {
  try {
    // Extract the JWT token from the "Authorization" header of the HTTP request
    const token = req.header("Authorization");


    // Verify the JWT token using a secret key ("kjhsgdfiuiew889kbasgdfskjabsdfjlabsbdljhsd")
     const user = jwt.verify(token, process.env.RAZORPAY_KEY_SECRET);
     
    // Find the user in the database based on the user ID stored in the JWT
    User.findByPk(user.userId).then((user) => {
      // Attach the user object to the request for further use in the route handler
      req.user = user;

      // Call the next middleware or route handler in the chain
      next();
    });
  } catch (err) {
    // Handle errors or exceptions that occur during authentication
    console.log(err);

    // Return a 401 (Unauthorized) status response if authentication fails
    return res.status(401).json({ success: false });
  }
};

module.exports = authenticate; // Export the middleware function for use in other parts of the application
