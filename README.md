# Digital Invoice Management System

A complete web application for managing invoices, customers, and payments built with the MERN-like stack but using JSON files as the database.

## Features

- User Authentication (Login / Logout)
- Dashboard with key metrics and recent activities
- Customer Management (CRUD)
- Invoice Management (CRUD) with automatic tax and total calculation
- Payment Management (Record payments, track status)
- Reports (Financial overview)
- Secure password hashing and JWT authentication
- Local JSON database

## Technologies Used

- **Frontend:** React, Vite, Tailwind CSS, React Router, Axios, Lucide React
- **Backend:** Node.js, Express, bcryptjs, jsonwebtoken, CORS
- **Database:** Local JSON files (\`server/data\`)

## Folder Structure

\`\`\`
invoice management/
├── client/                 # Frontend React Application
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages (Dashboard, Invoices, etc.)
│   │   ├── services/       # API integration
│   │   ├── App.jsx         # Routing configuration
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   └── tailwind.config.js
├── server/                 # Backend Express Application
│   ├── data/               # JSON database files
│   ├── middleware/         # Express middlewares (auth)
│   ├── routes/             # API routes
│   ├── server.js           # Main Express server
│   ├── seed.js             # Script to generate sample data
│   └── package.json
└── README.md
\`\`\`

## Installation & Setup

1. **Backend Setup**
   \`\`\`bash
   cd "invoice management/server"
   npm install
   npm run dev    # (or simply: node server.js)
   \`\`\`
   *The server runs on http://localhost:5000*

2. **Frontend Setup**
   Open a new terminal window:
   \`\`\`bash
   cd "invoice management/client"
   npm install
   npm run dev
   \`\`\`
   *The frontend will start on http://localhost:5173*

## Sample Credentials

All demo accounts use the password: \`password\`

- **Administrator:** admin@example.com (Full access)
- **Business Owner:** owner@example.com (Cannot manage users)
- **Accountant:** accountant@example.com (Invoices, Customers, Payments, Reports)
- **Customer:** customer@example.com (View invoices and payments)

## API Overview

**Auth:**
- \`POST /api/auth/login\`

**Dashboard:**
- \`GET /api/dashboard\`

**Customers:**
- \`GET /api/customers\`
- \`GET /api/customers/:id\`
- \`POST /api/customers\`
- \`PUT /api/customers/:id\`
- \`DELETE /api/customers/:id\`

**Invoices:**
- \`GET /api/invoices\`
- \`GET /api/invoices/:id\`
- \`POST /api/invoices\`
- \`PUT /api/invoices/:id\`
- \`DELETE /api/invoices/:id\`

**Payments:**
- \`GET /api/payments\`
- \`POST /api/payments\`
- \`PUT /api/payments/:id\`
- \`DELETE /api/payments/:id\`
