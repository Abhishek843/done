// Get references to various HTML elements using their IDs or classes
const categoryItems = document.querySelectorAll(".dropdown-item"); // Get all elements with the class "dropdown-item"
const categoryInput = document.querySelector("#categoryInput"); // Get the element with the ID "categoryInput"
const categoryBtn = document.querySelector("#categoryBtn"); // Get the element with the ID "categoryBtn"
const tbody = document.getElementById("tbodyId"); // Get the element with the ID "tbodyId"
const reportsLink = document.getElementById("reportsLink"); // Get the element with the ID "reportsLink"
const logoutBtn = document.getElementById("logoutBtn"); // Get the element with the ID "logoutBtn"

// Set the "href" attribute of the reportsLink element to "/reports/getReportsPage"
reportsLink.setAttribute("href", "/reports/getReportsPage");

// Define an asynchronous function for user logout
async function logout() {
  try {
    // Clear local storage
    localStorage.clear();
    
    // Redirect the user to the root URL ("/")
    window.location.href = "/";
  } catch (error) {
    console.log(error);
  }
}

// Add click event listeners to each category item in a dropdown
categoryItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    // When a category item is clicked, update the category button text and input value
    const selectedCategory = e.target.getAttribute("data-value");
    categoryBtn.textContent = e.target.textContent;
    categoryInput.value = selectedCategory;
  });
});

// Define an asynchronous function to get the leaderboard data
async function getLeaderboard() {
  try {
    // Send a GET request to retrieve the leaderboard data from an API
    const res = await axios.get("http://23.21.28.1:3200/premium/getLeaderboard");
    
    let position = 1; // Initialize the position variable to 1

    // Loop through the data and create table rows to display the leaderboard
    res.data.forEach((user) => {
      let name = user.name;
      let amount = user.amount;

      // Create a new table row
      let tr = document.createElement("tr");
      tr.setAttribute("class", "trStyle");

      // Append the table row to the table body
      tbody.appendChild(tr);

      // Create and populate table cells for position, name, and amount
      let th = document.createElement("th");
      th.setAttribute("scope", "row");
      th.appendChild(document.createTextNode(position++));

      let td1 = document.createElement("td");
      td1.appendChild(document.createTextNode(name));

      let td2 = document.createElement("td");
      td2.appendChild(document.createTextNode(amount));

      // Append the table cells to the table row
      tr.appendChild(th);
      tr.appendChild(td1);
      tr.appendChild(td2);
    });
  } catch (error) {
    console.log(error);
  }
}

// Add a click event listener to the logout button to trigger the logout function
logoutBtn.addEventListener("click", logout);

// Add a DOMContentLoaded event listener to trigger the getLeaderboard function when the page loads
document.addEventListener("DOMContentLoaded", getLeaderboard);
