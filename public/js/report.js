// Get references to various HTML elements using their IDs
const dateInput = document.getElementById("date");
const dateShowBtn = document.getElementById("dateShowBtn");
const tbodyDaily = document.getElementById("tbodyDailyId");
const tfootDaily = document.getElementById("tfootDailyId");

const downloadBtn = document.getElementById('downloadBtn');

const monthInput = document.getElementById("month");
const monthShowBtn = document.getElementById("monthShowBtn");
const tbodyMonthly = document.getElementById("tbodyMonthlyId");
const tfootMonthly = document.getElementById("tfootMonthlyId");

const leaderboardLink = document.getElementById("leaderboardLink");
const logoutBtn = document.getElementById("logoutBtn");

// Set the "href" attribute of the leaderboardLink element to "/premium/getLeaderboardPage"
leaderboardLink.setAttribute("href", "/premium/getLeaderboardPage");

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

// Define an asynchronous function to get daily expense reports
async function getDailyReport(e) {
  try {
    e.preventDefault(); // Prevent the default form submission behavior
    const token = localStorage.getItem("token"); // Get the user's token from local storage

    // Parse the date input value and format it as "dd-mm-yyyy"
    const date = new Date(dateInput.value);
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getFullYear()}`;

    let totalAmount = 0; // Initialize a variable to calculate the total amount

    // Send a POST request to retrieve daily expense reports
    const res = await axios.post(
      "http://23.21.28.1:3200/reports/dailyReports",
      {
        date: formattedDate,
      },
      { headers: { Authorization: token } }
    );

    // Clear the table body and footer
    tbodyDaily.innerHTML = "";
    tfootDaily.innerHTML = "";

    // Loop through the data and populate the table
    res.data.forEach((expense) => {
      totalAmount += expense.amount; // Update the total amount

      // Create a new table row
      const tr = document.createElement("tr");
      tr.setAttribute("class", "trStyle");
      tbodyDaily.appendChild(tr);

      // Create and populate table cells for date, category, description, and amount
      const th = document.createElement("th");
      th.setAttribute("scope", "row");
      th.appendChild(document.createTextNode(expense.date));

      const td1 = document.createElement("td");
      td1.appendChild(document.createTextNode(expense.category));

      const td2 = document.createElement("td");
      td2.appendChild(document.createTextNode(expense.description));

      const td3 = document.createElement("td");
      td3.appendChild(document.createTextNode(expense.amount));

      // Append the table cells to the table row
      tr.appendChild(th);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
    });

    // Create a row in the footer to display the total amount
    const tr = document.createElement("tr");
    tr.setAttribute("class", "trStyle");
    tfootDaily.appendChild(tr);

    // Create table cells to display "Total" and the calculated total amount
    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    const td4 = document.createElement("td");

    td3.setAttribute("id", "dailyTotal");
    td4.setAttribute("id", "dailyTotalAmount");
    td3.appendChild(document.createTextNode("Total"));
    td4.appendChild(document.createTextNode(totalAmount));

    // Append the table cells to the row in the footer
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
  } catch (error) {
    console.log(error);
  }
}
async function download() {
  try {
    const token = localStorage.getItem("token"); // Get the user's token from local storage

    // Send a GET request to retrieve the report data from the server
    const res = await axios.get(
      "http://23.21.28.1:3200/reports/downloadReport",
      {
        headers: { Authorization: token },
        responseType: "blob", // Set the response type to "blob" for binary data
      }
    );

    // Create a Blob object from the response data
    const blob = new Blob([res.data], { type: "application/octet-stream" });

    // Generate a temporary URL for the Blob
    const url = window.URL.createObjectURL(blob);

    // Create an anchor element to trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = "report.csv"; // Set the desired file name and extension

    // Programmatically click the anchor to start the download
    a.click();

    // Release the URL object to free up resources
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.log(error);
  }
}

// Define an asynchronous function to get monthly expense reports
async function getMonthlyReport(e) {
  try {
    e.preventDefault(); // Prevent the default form submission behavior
    const token = localStorage.getItem("token"); // Get the user's token from local storage

    // Parse the month input value and format it as "mm"
    const month = new Date(monthInput.value);
    const formattedMonth = `${(month.getMonth() + 1).toString().padStart(2, "0")}`;

    let totalAmount = 0; // Initialize a variable to calculate the total amount

    // Send a POST request to retrieve monthly expense reports
    const res = await axios.post(
      "http://23.21.28.1:3200/reports/monthlyReports",
      {
        month: formattedMonth,
      },
      { headers: { Authorization: token } }
    );

    // Clear the table body and footer
    tbodyMonthly.innerHTML = "";
    tfootMonthly.innerHTML = "";

    // Loop through the data and populate the table
    res.data.forEach((expense) => {
      totalAmount += expense.amount; // Update the total amount

      // Create a new table row
      const tr = document.createElement("tr");
      tr.setAttribute("class", "trStyle");
      tbodyMonthly.appendChild(tr);

      // Create and populate table cells for date, category, description, and amount
      const th = document.createElement("th");
      th.setAttribute("scope", "row");
      th.appendChild(document.createTextNode(expense.date));

      const td1 = document.createElement("td");
      td1.appendChild(document.createTextNode(expense.category));

      const td2 = document.createElement("td");
      td2.appendChild(document.createTextNode(expense.description));

      const td3 = document.createElement("td");
      td3.appendChild(document.createTextNode(expense.amount));

      // Append the table cells to the table row
      tr.appendChild(th);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
    });

    // Create a row in the footer to display the total amount
    const tr = document.createElement("tr");
    tr.setAttribute("class", "trStyle");
    tfootMonthly.appendChild(tr);

    // Create table cells to display "Total" and the calculated total amount
    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    const td4 = document.createElement("td");

    td3.setAttribute("id", "monthlyTotal");
    td4.setAttribute("id", "monthlyTotalAmount");
    td3.appendChild(document.createTextNode("Total"));
    td4.appendChild(document.createTextNode(totalAmount));

    // Append the table cells to the row in the footer
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
  } catch (error) {
    console.log(error);
  }
}

// Add click event listeners to the logout button, date show button, and month show button
logoutBtn.addEventListener("click", logout);
dateShowBtn.addEventListener("click", getDailyReport);
monthShowBtn.addEventListener("click", getMonthlyReport);
downloadBtn.addEventListener("click",download);
