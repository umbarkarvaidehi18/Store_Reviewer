# Store Rating Management System

A production-ready, full-stack **Store Rating Management System** with a Node.js Express & Sequelize (MySQL) backend and a React Vite & Tailwind CSS frontend.

---

## Features

- **Single Sign-On (SSO)** with secure bcrypt password hashing and JWT authentication.
- **Three System Roles**:
  - **Admin**: Full control over users and stores, sorting, searching, filtering, and a dashboard showing stats (Total Users, Stores, and Ratings).
  - **Regular User (Customer)**: Browse stores, search by name/address, view average ratings, submit a new rating, or edit their existing rating (1 to 5 stars).
  - **Store Owner**: Dashboard aggregating owned store metrics, listing all stores, and viewing customer logs containing user names, emails, and ratings.
- **Premium UI**: Crafted with dynamic animations, modern dark mode glassmorphism (slate background with brand indigo/blue accents), and responsive layouts.
- **Auto-created Database**: The backend checks and initializes the database automatically upon launch, seeding default mock data if empty.

---

## Default Credentials (Pre-Seeded)

All passwords are: **`Password@123`**

| Role | Name | Email | Password |
|---|---|---|---|
| **Admin** | `System Administrator Principal Account` | `admin@example.com` | `Password@123` |
| **Store Owner** | `Store Owner Representative John` | `owner@example.com` | `Password@123` |
| **Regular User** | `Regular Customer Account Jane` | `user@example.com` | `Password@123` |

---

## Installation & Setup

### Prerequisites

- **Node.js** (v18+ recommended)
- **MySQL Server** (running locally on port 3306)

---

### Step 1: Backend Configuration

1. The backend configuration is stored inside `backend/.env`.
2. Open `backend/.env` and update the database settings if your MySQL requires a password or runs on a different port:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASS=your_mysql_password_here
   DB_NAME=store_rating_db
   JWT_SECRET=store_rating_secret_key_2026_xyz
   JWT_EXPIRE=24h
   ```

### Step 2: Running the Application

To run the application, start both the backend and frontend servers:

#### 1. Start the Backend
In a terminal, navigate to the `backend` folder and start the dev server:
```bash
cd backend
npm run dev
```
*Note: The server will verify/create the `store_rating_db` database, sync the tables via Sequelize, and seed default admin/owner/user/store/ratings data.*

#### 2. Start the Frontend
In a separate terminal, navigate to the `frontend` folder and start the dev server:
```bash
cd frontend
npm run dev
```
*Note: The frontend server starts on [http://localhost:3000](http://localhost:3000) and automatically proxies API calls to [http://localhost:5000](http://localhost:5000).*

---

## Architecture and Project Structure

```
Store-Rating-System
├── backend
│   ├── config         # Sequelize and database configurations
│   ├── controllers    # REST API request handlers (Auth, Admin, Owner, User)
│   ├── middlewares    # JWT token checks and role gatekeepers
│   ├── models         # Sequelize schemas (User, Store, Rating)
│   ├── routes         # Express routers mapping to endpoints
│   ├── validations    # Custom validators matching length and regex requirements
│   ├── app.js         # Express app initialization
│   └── server.js      # Database check, seeding, and server execution
└── frontend
    ├── public         # Static public resources
    └── src
        ├── api        # Axios instance configured with JWT request interceptors
        ├── components # Reusable UI components (Navbar, Sidebar, Tables, Modal)
        ├── context    # Auth Context providing login/logout states
        ├── layouts    # Shared layouts (DashboardLayout)
        ├── pages      # Page views (Admin console, Customer listing, Owner stats)
        ├── routes     # Protected routing and guards
        ├── index.css  # Global stylesheets and custom glassmorphism classes
        ├── App.jsx    # Client router declaration
        └── main.jsx   # App mounting configuration
```
