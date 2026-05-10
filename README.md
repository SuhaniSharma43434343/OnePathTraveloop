# OnePathTravel — MERN Stack App

## Project Structure
```
Onepath travel/
├── backend/          # Node.js + Express + MongoDB
│   ├── models/       # Mongoose schemas
│   ├── routes/       # REST API routes
│   ├── middleware/   # JWT auth middleware
│   ├── uploads/      # User avatar uploads
│   └── server.js     # Entry point
└── frontend/         # React.js
    └── src/
        ├── api/      # Axios API calls
        ├── context/  # Auth + Theme context
        ├── components/
        └── pages/    # AuthPage, WelcomePage, Dashboard
```

## Setup & Run

### Prerequisites
- Node.js >= 16
- MongoDB running locally on port 27017

### Backend
```bash
cd backend
npm install
# Edit .env if needed (MONGO_URI, JWT_SECRET, PORT)
npm start
```

### Frontend
```bash
cd frontend
npm install
npm start
```

App runs at: http://localhost:3000  
API runs at: http://localhost:5000

## Features
- Register / Login with JWT auth
- **Welcome/Entry page** after login with:
  - Circular avatar (click to upload)
  - User details card (Name, Email, Role)
  - Animated entry (fade + slide-up)
  - Loading skeleton while fetching user data
  - Disabled "Continue" button until data loads
  - Light/Dark theme toggle
- Protected routes
- Responsive mobile/desktop layout
