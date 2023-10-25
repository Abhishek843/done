# Expense-Tracker-Project
# Expense Tracker API

Expense Tracker is a Node.js and Express-based backend API that helps users manage their expenses. It includes features like premium membership using Razorpay, all-time expense reports and reports can be downloaded, and a leaderboard based on user expenses and forgot password feature. The project also integrates security measures using Helmet and logs requests with Morgan.

## Features

- **User Authentication:** Implemented a secure user authentication system using secret keys and tokens.
- **Premium Membership:** Users can purchase premium features using Razorpay.
- **Expense Management:** Allows users to track and manage their expenses.
- **All-Time Expense Reports:** Users can generate reports for all-time expenses.
- **Download Expense Report
- **Leaderboard:** Displays a leaderboard ranking users based on their total expenses.
- **Security:** Utilizes Helmet to enhance API security.
- **Logging:** Request and response logging using Morgan.

## Technologies Used

- Node.js: Server-side runtime environment.
- Express.js: Web application framework for building APIs.
- MySQL: Relational database for storing user data and expenses.
- Razorpay: Payment gateway for premium memberships.
- Helmet: Middleware for enhancing API security.
- Morgan: Middleware for request/response logging.

## Getting Started

1. Clone the repository: `git clone https://github.com/Mukulpathak4/Expense-Tracker-Project.git`
2. Install dependencies: `npm install`
3. Configure your MySQL database connection using environment file.
4. Set up your secret keys and tokens for authentication.
5. Start the server: `npm start`

## API Endpoints

- **Authentication**
  - `POST /`: Register a new user or Login If existing user.
  - Use logout button to logout By this all localstorage data will be clear.
  
- **Expense Management**
  - `POST expense/addExpense`: Add a new expense.
  - `GET expense/getAllExpenses`: Get all expenses.
  - `GET expense/getAllExpenses/:id`: Get a specific expense by ID.
  - `PUT expense/editExpense/:id`: Update an existing expense.
  - `DELETE expense/deleteExpense/:id`: Delete an expense by ID.
  
- **Premium Membership**
  - `POST purchase/premiumMembership`: Purchase premium membership using Razorpay.
  
- **Reports**
  - `GET report/dailyReports`: Generate a Daily expense report.
  - `GET report/monthlyReports`: Generate a Monthly expense report.
  
- **Leaderboard**
  - `GET /getLeaderboard`: Get the user leaderboard.

- **Forgot Password**
  - `POST /password/resetPasswordPage/:requestId"`: Initiate the password reset process.
  - `POST /password/resetPassword/:token`: Reset the password using the provided token.

## Configuration

- Database Configuration: Update the MySQL database connection details in environment file.
- Secret Keys and Tokens: Set your secret keys and tokens for authentication.

## Usage

- Register a new user using `/api/auth/register`.
- Log in using `/api/auth/login` to access user-specific features.
- Purchase premium membership using `/api/premium` to unlock premium features.
- Manage expenses with the `/api/expenses` endpoints.
- Generate expense reports using `/api/reports`.
- View the leaderboard with `/api/leaderboard`.

## Security

This project prioritizes security with Helmet middleware and secure authentication mechanisms. Ensure that you keep your secret keys and tokens safe.

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests to help improve this project.

## License

This project is licensed under the [MIT License](LICENSE).
