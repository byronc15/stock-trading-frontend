
**2. Frontend README (`stock-trading-frontend/README.md`)**

```markdown
# Stock Trading UI - Frontend (React)

This project implements the frontend user interface for a simplified stock trading simulation application, built with React. It consumes the NestJS backend API to display stock information, allow trading, and show the user's portfolio.

## Features

*   **Market View:** Displays a list of available stocks with their names and current prices.
*   **Trading:** Allows users to select a stock, choose 'Buy' or 'Sell', enter a quantity, and submit trades.
*   **Portfolio View:** Shows the user's current cash balance, detailed stock holdings (symbol, quantity, current value), and the total portfolio value.
*   **Live Updates:** Stock prices and portfolio values automatically refresh periodically (approx. every 20 seconds). A manual refresh button is also available.
*   **User Feedback:** Displays loading states, success messages on successful trades, and error messages if trades fail or data fetching encounters issues.

## Prerequisites

*   Node.js (v18 or later recommended)
*   npm or yarn
*   A running instance of the [Stock Trading Backend API](https://github.com/byronc15/stock-trading-backend.git) (defaults to `http://localhost:3000`).

## Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/byronc15/stock-trading-frontend.git
    cd stock-trading-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure API URL (Optional):**
    The application connects to the backend API at `http://localhost:3000` by default (defined in `src/services/api.js`)

## Running the Application

```bash
# Start the development server (usually with hot-reloading)
npm start
# or (if using Vite)
npm run dev