// Import necessary modules and dependencies.
const path = require("path");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// Function to generate an access token for a user.
function generateAccessToken(id, email) {
  // Create a JWT token with user information and the correct secret key.
  return jwt.sign({ userId: id, email: email }, process.env.RAZORPAY_KEY_SECRET);
}


// Middleware to check if a user is a premium user.
const isPremiumUser = (req, res, next) => {
  // Check if the user's "isPremiumUser" flag is true.
  if (req.user.isPremiumUser) {
    return res.json({ isPremiumUser: true });
  }
};

// Function to render the login page.
const getLoginPage = (req, res, next) => {
  // Send the login page HTML file to the client.
  res.sendFile(path.join(__dirname, "../", "public", "html", "user.html"));
};

// Function to handle user signup.
const postUserSignUp = async (req, res, next) => {
  try {
    // Extract user data from the request body.
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    // Check if a user with the same email already exists in the database.
    const existingUser = await User.findOne({ where: { email: email } });

    if (existingUser) {
      // If a user with the same email exists, send a conflict (status 409) response.
      return res.status(409).json({ message: 'This email is already taken. Please choose another one.' });
    }

    // If no user with the same email exists, hash the user's password securely.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user record in the database.
    await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    // Send a success (status 200) response after user creation.
    return res.status(200).send(
      `<script>alert('User Created Successfully!'); window.location.href='/'</script>`
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while creating the user.");
  }
};

// Function to handle user login.
const postUserLogin = (req, res, next) => {
  // Extract login email and password from the request body.
  const email = req.body.loginEmail;
  const password = req.body.loginPassword;

  // Check if a user with the provided email exists in the database.
  User.findOne({ where: { email: email } }).then((user) => {
    if (user) {
      // If a user with the provided email exists, compare the hashed password.
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          // Handle unexpected errors with a 500 status response.
          return res
            .status(500)
            .json({ success: false, message: "Something went wrong!" });
        }
        if (result == true) {
          // If the password matches, send a success (status 200) response with an access token.
          return res.status(200).json({
            success: true,
            message: "Login successful!",
            token: generateAccessToken(user.id, user.email),
          });
        } else {
          // If the password is incorrect, send a unauthorized (status 401) response.
          return res.status(401).json({
            success: false,
            message: "Password incorrect!",
          });
        }
      });
    } else {
      // If no user with the provided email exists, send a not found (status 404) response.
      return res.status(404).json({
        success: false,
        message: "User doesn't exist!",
      });
    }
  });
};


// Export the defined functions for use in other parts of the application.
module.exports = {
  generateAccessToken,
  getLoginPage,
  postUserLogin,
  postUserSignUp,
  isPremiumUser,
};