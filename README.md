# Worknoon Assessment - Frontend

This is the frontend repository for the **AI-Powered Support Assistant** built as part of the Full Stack Engineer assessment for Worknoon. It provides a sleek, modern chat interface for customers to interact with an AI support agent.

## 🌟 Overview

The frontend is built to feel like a premium, modern SaaS product. Features include:
- A dark-themed glassmorphic UI.
- Two-phase interface: an identification screen followed by a real-time chat interface.
- Smooth micro-animations, typing indicators, and responsive message bubbles.
- Dynamic error handling and communication with the Django backend.

## 🛠️ Tech Stack
- **React** (via Vite)
- **Axios** (for API communication)
- **CSS Modules** (for scoped, professional styling without external frameworks)

## 🚀 How to Run the Project Locally

### 1. Prerequisites
- Node.js (v16+ recommended)
- The backend API must be running locally on `http://localhost:8000` (See the Backend repository for instructions).

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```
The app will typically run on `http://localhost:5173/` or `http://localhost:5174/`. Open the link in your browser to view the app.

---

## 🧠 How the Architecture Works

1. **Frontend (React)**: Captures user input (Customer ID/Name and Message) and renders the UI. It sends the data to the backend via Axios HTTP requests.
2. **Backend (Django)**: Acts as the secure orchestrator. It queries the local SQLite database for the customer's purchase history and past chat messages.
3. **AI Integration (Gemini)**: The backend securely combines the user's message, their purchase history, and the strict company refund policy, and sends it to the Gemini API. The AI evaluates the rules and generates a response as a virtual agent named "Alex", which is returned through the backend to the React interface.

### Test Data
You can test the application using the seeded database from the backend. Use one of the following Customer IDs to see how the AI handles different scenarios:
- **CUST001**: Eligible for a refund (under 14 days, under $500).
- **CUST002**: Escalation required (amount over $500).
- **CUST003**: Denied refund (item was a "Final Sale").
- **CUST005**: Denied refund (past the 14-day return window).

## 🔗 Links
- **Backend Repository**: [GitHub Link to Backend Repo]
- **Video Walkthrough**: *(Video link goes here)*
