// Get references to the login and signup buttons from the HTML document.
const loginButton = document.getElementById("signInBtn");
const signupButton = document.getElementById("signUpBtn");

// Get references to login and signup form input fields.
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const signUpName = document.getElementById("name"); // Assuming there's a name input field
const signUpEmail = document.getElementById("signupEmail");
const signUpPassword = document.getElementById("signupPassword");

// Function to handle the login process.
function login() {
  // Create an object with login details from the input fields.
  
  const loginDetails = {
    loginEmail: loginEmail.value, // Get the email from the loginEmail input field
    loginPassword: loginPassword.value, // Get the password from the loginPassword input field
  };

  // Send a POST request to the server to log in the user.
  axios
    .post("http://23.21.28.1:3200/login", loginDetails)
    .then((result) => {
      // Display a success message and store the token in local storage.
      alert(result.data.message);
      localStorage.setItem("token", result.data.token);

      // Redirect to the home page.
      window.location.href = "/homePage";
    })
    .catch((error) => {
      if (error.response) {
        // If the server responds with an error, display the error message.
        const errorMessage = error.response.data.message;
        alert(errorMessage);
      } else {
        // If there's a network error or other issues, display a generic error message.
        alert("An error occurred. Please try again later.");
      }
    });
}

// Add a click event listener to the login button to trigger the login function.
loginButton.addEventListener("click", login);

// Function to handle the signup process.
function signup() {
  // Create an object with signup details from the input fields.
  const signUpDetails = {
    name: signUpName.value, // Get the name from the name input field
    email: signUpEmail.value, // Get the email from the signupEmail input field
    password: signUpPassword.value, // Get the password from the signupPassword input field
  };

  // Send a POST request to the server to sign up the user.
  axios
    .post('http://23.21.28.1:3200/signup', signUpDetails)
    .then((result) => {
      // Display a success message.
      alert('Done! You Can Login Now.');

      // Redirect to the login page.
      window.location.href = "/";
    })
    .catch((error) => {
      if (error.response) {
        // If the server responds with an error, display the error message.
        const errorMessage = error.response.data.message;
        alert(errorMessage);
      } else {
        // If there's a network error or other issues, display a generic error message.
        alert("An error occurred. Please try again later.");
      }
    });
}

// Add a click event listener to the signup button to trigger the signup function.
signupButton.addEventListener("click", signup);
