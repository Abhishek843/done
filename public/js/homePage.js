// Get references to various HTML elements using their IDs or classes
const categoryItems = document.querySelectorAll(".dropdown-item");
const categoryInput = document.querySelector("#categoryInput");
const categoryBtn = document.querySelector("#categoryBtn");
const form = document.getElementById("form1");
const addExpenseBtn = document.getElementById("submitBtn");
const table = document.getElementById("tbodyId");
const buyPremiumBtn = document.getElementById("buyPremiumBtn");
const reportsLink = document.getElementById("reportsLink");
const leaderboardLink = document.getElementById("leaderboardLink");
const logoutBtn = document.getElementById("logoutBtn");

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

// Define an asynchronous function for adding an expense
async function addExpense() {
  try {
    // Get references to various input fields and values
    const category = document.getElementById("categoryBtn");
    const description = document.getElementById("descriptionValue");
    const amount = document.getElementById("amountValue");
    const categoryValue = category.textContent.trim();
    const descriptionValue = description.value.trim();
    const amountValue = amount.value.trim();

    // Check for validation conditions
    if (categoryValue == "Select Category") {
      alert("Select the Category!");
      window.location.href("/homePage");
    }
    if (!descriptionValue) {
      alert("Add the Description!");
      window.location.href("/homePage");
    }
    if (!parseInt(amountValue)) {
      alert("Please enter a valid amount!");
      window.location.href("/homePage");
    }

    // Get the current date
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    // Add leading zeros to day and month if needed
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    // Create the date string in date-month-year format
    const dateStr = `${formattedDay}-${formattedMonth}-${year}`;

    // Get the user's token from local storage
    const token = localStorage.getItem("token");

    // Send a POST request to add the expense
    const res = await axios.post(
      "http://23.21.28.1:3200/expense/addExpense",
      {
        date: dateStr,
        category: categoryValue,
        description: descriptionValue,
        amount: parseInt(amountValue),
      },
      { headers: { Authorization: token } }
    );

    // If the request is successful (status code 200), reload the page
    if (res.status == 200) {
      window.location.reload();
    }
  } catch {
    console.error("AddExpense went wrong");
  }
}

// Define an asynchronous function to get all expenses
async function getAllExpenses() {
  try {
    // Get the user's token from local storage
    const token = localStorage.getItem("token");

    // Send a GET request to retrieve all expenses
    const res = await axios.get(
      "http://23.21.28.1:3200/expense/getAllExpenses/1",
      { headers: { Authorization: token } }
    );

    // Loop through the expenses and populate the table
    res.data.expenses.forEach((expenses) => {
      // Extract expense data
      const id = expenses.id;
      const date = expenses.date;
      const categoryValue = expenses.category;
      const descriptionValue = expenses.description;
      const amountValue = expenses.amount;

      // Create table row and cells
      let tr = document.createElement("tr");
      tr.className = "trStyle";
      table.appendChild(tr);

      let idValue = document.createElement("th");
      idValue.setAttribute("scope", "row");
      idValue.setAttribute("style", "display: none");

      let th = document.createElement("th");
      th.setAttribute("scope", "row");

      tr.appendChild(idValue);
      tr.appendChild(th);

      idValue.appendChild(document.createTextNode(id));
      th.appendChild(document.createTextNode(date));

      let td1 = document.createElement("td");
      td1.appendChild(document.createTextNode(categoryValue));

      let td2 = document.createElement("td");
      td2.appendChild(document.createTextNode(descriptionValue));

      let td3 = document.createElement("td");
      td3.appendChild(document.createTextNode(amountValue));

      let td4 = document.createElement("td");

      let deleteBtn = document.createElement("button");
      deleteBtn.className = "editDelete btn btn-danger delete";
      deleteBtn.appendChild(document.createTextNode("Delete"));

      let editBtn = document.createElement("button");
      editBtn.className = "editDelete btn btn-success edit";
      editBtn.appendChild(document.createTextNode("Edit"));

      td4.appendChild(deleteBtn);
      td4.appendChild(editBtn);

      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
    });

    // Create pagination links
    const ul = document.getElementById("paginationUL");
    for (let i = 1; i <= res.data.totalPages; i++) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      li.setAttribute("class", "page-item");
      a.setAttribute("class", "page-link");
      a.setAttribute("href", "#");
      a.appendChild(document.createTextNode(i));
      li.appendChild(a);
      ul.appendChild(li);
      a.addEventListener("click", paginationBtn);
    }
  } catch {
    (err) => console.log(err);
  }
}

// Define an asynchronous function to delete an expense
async function deleteExpense(e) {
  try {
    // Get the user's token from local storage
    const token = localStorage.getItem("token");

    // Check if the clicked element is a delete button
    if (e.target.classList.contains("delete")) {
      let tr = e.target.parentElement.parentElement;
      let id = tr.children[0].textContent;

      // Send a GET request to delete the expense
      const res = await axios.get(
        `http://23.21.28.1:3200/expense/deleteExpense/${id}`,
        { headers: { Authorization: token } }
      );

      // Reload the page
      window.location.reload();
    }
  } catch {
    (err) => console.log(err);
  }
}

// Define an asynchronous function to edit an expense
async function editExpense(e) {
  try {
    // Get the user's token from local storage
    const token = localStorage.getItem("token");
    const categoryValue = document.getElementById("categoryBtn");
    const descriptionValue = document.getElementById("descriptionValue");
    const amountValue = document.getElementById("amountValue");
    const addExpenseBtn = document.getElementById("submitBtn");

    // Check if the clicked element is an edit button
    if (e.target.classList.contains("edit")) {
      let tr = e.target.parentElement.parentElement;
      let id = tr.children[0].textContent;

      // Send a GET request to retrieve all expenses
      const res = await axios.get(
        "http://23.21.28.1:3200/expense/getAllExpenses",
        { headers: { Authorization: token } }
      );

      // Loop through expenses to find the one to edit
      res.data.forEach((expense) => {
        if (expense.id == id) {
          // Update input values with existing values
          categoryValue.textContent = expense.category;
          descriptionValue.value = expense.description;
          amountValue.value = expense.amount;
          addExpenseBtn.textContent = "Update";

          // Remove the click event listener for adding expenses
          addExpenseBtn.removeEventListener("click", addExpense);

          // Add a click event listener for updating the expense
          addExpenseBtn.addEventListener("click", async function update(e) {
            e.preventDefault();

            // Send a POST request to update the expense
            const res = await axios.post(
              `http://23.21.28.1:3200/expense/editExpense/${id}`,
              {
                category: categoryValue.textContent.trim(),
                description: descriptionValue.value,
                amount: amountValue.value,
              },
              { headers: { Authorization: token } }
            );

            // Reload the page
            window.location.reload();
          });
        }
      });
    }
  } catch {
    (err) => console.log(err);
  }
}

// Define an asynchronous function to handle buying premium membership
async function buyPremium(e) {
  // Get the user's token from local storage
  const token = localStorage.getItem("token");

  // Send a GET request to initiate premium membership purchase
  const res = await axios.get(
    "http://23.21.28.1:3200/purchase/premiumMembership",
    { headers: { Authorization: token } }
  );

  console.log(res);

  // Define options for the Razorpay payment
  var options = {
    key: res.data.key_id, // Enter the Key ID generated from the Dashboard
    order_id: res.data.order.id, // For one-time payment
    // This handler function will handle the successful payment
    handler: async function (response) {
      const res = await axios.post(
        "http://23.21.28.1:3200/purchase/updateTransactionStatus",
        {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
        },
        { headers: { Authorization: token } }
      );

      console.log(res);

      // Show a success message and reload the page
      alert("Welcome to our Premium Membership! You now have access to Reports and LeaderBoard");
      window.location.reload();
      localStorage.setItem("token", res.data.token);
    },
  };

  // Create a new Razorpay instance with the defined options
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();
}

// Define an asynchronous function to check if the user is a premium member
async function isPremiumUser() {
  const token = localStorage.getItem("token");

  // Send a GET request to check if the user is a premium member
  const res = await axios.get("http://23.21.28.1:3200/isPremiumUser", {
    headers: { Authorization: token },
  });

  if (res.data.isPremiumUser) {
    // Update the buyPremiumBtn text and behavior for premium members
    buyPremiumBtn.innerHTML = `<span style="font-size: 1.4em; margin-right: 5px;">&#128081</span><span style="color: white;">Premium Member</span>`;
    reportsLink.removeAttribute("onclick");
    leaderboardLink.removeAttribute("onclick");
    leaderboardLink.setAttribute("href", "/premium/getLeaderboardPage");
    reportsLink.setAttribute("href", "/reports/getReportsPage");
    buyPremiumBtn.removeEventListener("click", buyPremium);
  }
}

// Define a function to handle pagination button clicks
async function paginationBtn(e) {
  try {
    const pageNo = e.target.textContent;
    const token = localStorage.getItem("token");

    // Send a GET request to retrieve expenses for the selected page
    const res = await axios.get(
      `http://23.21.28.1:3200/expense/getAllExpenses/${pageNo}`,
      { headers: { Authorization: token } }
    );

    // Clear the table
    table.innerHTML = "";

    // Loop through the expenses and populate the table
    res.data.expenses.forEach((expenses) => {
      // Extract expense data
      const id = expenses.id;
      const date = expenses.date;
      const categoryValue = expenses.category;
      const descriptionValue = expenses.description;
      const amountValue = expenses.amount;

      // Create table row and cells
      let tr = document.createElement("tr");
      tr.className = "trStyle";
      table.appendChild(tr);

      let idValue = document.createElement("th");
      idValue.setAttribute("scope", "row");
      idValue.setAttribute("style", "display: none");

      let th = document.createElement("th");
      th.setAttribute("scope", "row");

      tr.appendChild(idValue);
      tr.appendChild(th);

      idValue.appendChild(document.createTextNode(id));
      th.appendChild(document.createTextNode(date));

      let td1 = document.createElement("td");
      td1.appendChild(document.createTextNode(categoryValue));

      let td2 = document.createElement("td");
      td2.appendChild(document.createTextNode(descriptionValue));

      let td3 = document.createElement("td");
      td3.appendChild(document.createTextNode(amountValue));

      let td4 = document.createElement("td");

      let deleteBtn = document.createElement("button");
      deleteBtn.className = "editDelete btn btn-danger delete";
      deleteBtn.appendChild(document.createTextNode("Delete"));

      let editBtn = document.createElement("button");
      editBtn.className = "editDelete btn btn-success edit";
      editBtn.appendChild(document.createTextNode("Edit"));

      td4.appendChild(deleteBtn);
      td4.appendChild(editBtn);

      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
    });
  } catch (error) {
    console.log(error);
  }
}

// Add event listeners to various elements
buyPremiumBtn.addEventListener("click", buyPremium);
addExpenseBtn.addEventListener("click", addExpense);
document.addEventListener("DOMContentLoaded", isPremiumUser);
document.addEventListener("DOMContentLoaded", getAllExpenses);
table.addEventListener("click", (e) => {
  deleteExpense(e);
});
table.addEventListener("click", (e) => {
  editExpense(e);
});
logoutBtn.addEventListener("click", logout);
