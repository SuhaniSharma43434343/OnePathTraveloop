# OnePathTravel — MERN Stack App

## Project Structure
```
Onepath travel/
├── backend/
│   ├── models/         # Mongoose schemas (User, Destination, Booking)
│   ├── routes/         # REST API routes (auth, user)
│   ├── middleware/     # JWT auth middleware
│   ├── uploads/        # User avatar uploads
│   └── server.js       # Entry point
└── frontend/
    └── src/
        ├── api/        # Axios API calls
        ├── context/    # Auth + Theme context
        ├── components/ # ThemeToggle
        │   └── styles/
        ├── pages/      # AuthPage, WelcomePage, Dashboard
        │   └── styles/
        └── styles/     # global.css
```

## Setup & Run

### Prerequisites
- Node.js >= 16
- MongoDB Atlas account (connection string in `.env`)

### Backend
```bash
cd backend
npm install
# Create .env file with:
# MONGO_URI=mongodb+srv://<user>:<password>@cluster0.dhrmtnt.mongodb.net/onepath_travel?retryWrites=true&w=majority&appName=Cluster0
# JWT_SECRET=onepath_super_secret_key_2024
# PORT=5000
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
- Photo upload during registration (optional)
- **Welcome/Entry page** after login with:
  - Circular avatar (uploaded photo or initials fallback)
  - User details card (Name, Email, Role)
  - Staggered fade + slide-up animations
  - Loading skeleton while fetching user data
  - Disabled "Continue" button until data loads
  - Light/Dark theme toggle
- Smart validation — errors only on blur or submit, never on keystroke
- Specific error messages (not generic "something went wrong")
- Protected routes
- Responsive mobile/desktop layout

## Database — MongoDB Atlas

### Collections
| Collection | Documents | Description |
|---|---|---|
| users | 7 | Registered users with hashed passwords |
| destinations | 12 | Travel destinations with ratings & prices |
| bookings | 10 | User bookings linked to destinations |

### Test Credentials
| Role | Email | Password |
|---|---|---|
| Admin | suhani@onePathtravel.com | admin1234 |
| Traveler | riya@example.com | password123 |
| Agent | priya@example.com | password123 |

### Sample Destinations
Bali · Paris · Manali · Santorini · Kyoto · Machu Picchu · Goa · Dubai · Ladakh · New York · Maldives · Rajasthan
