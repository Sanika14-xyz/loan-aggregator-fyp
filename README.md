# Loan Aggregator FYP

## Project Setup

Follow these steps to run the project in VS Code:

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Connection String (in `.env`)

### 1. Backend Setup
1. Open a new terminal in VS Code (`Ctrl + ~`).
2. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
3. Install dependencies (if not already done):
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```
   *The server runs on http://localhost:5000*

### 2. Frontend Setup
1. Open a **second** terminal (split terminal or new tab).
2. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the React development server:
   ```bash
   npm run dev
   ```
   *Open the link shown (usually http://localhost:5173) in your browser.*

### File Structure
- `backend/`: Node.js + Express API
- `frontend/`: React + Vite Application
