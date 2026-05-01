# TaskManager Pro 🚀

TaskManager Pro is a robust, full-stack MERN (MongoDB, Express, React, Node.js) application designed for seamless team collaboration. It features role-based access control, real-time task management via a Kanban-style interface, and interactive project dashboards.

---

## ✨ Key Features

*   **Secure Authentication:** JWT-based login and registration with encrypted passwords (bcrypt).
*   **Role-Based Access Control (RBAC):** 
    *   **Admins:** Have global access to create projects, invite users, and assign tasks.
    *   **Members:** Have restricted access to view and interact only with projects and tasks explicitly assigned to them.
*   **Dynamic Task Management:** Create, edit, and track tasks across `To Do`, `In Progress`, and `Completed` stages.
*   **Task Metadata:** Track due dates, priority levels (`Low`, `Medium`, `High`), and collaborate using the task comment system.
*   **Analytics Dashboard:** Get a quick overview of total, pending, completed, and overdue tasks.
*   **Responsive UI:** Built with TailwindCSS and Framer Motion for a sleek, modern, and mobile-friendly experience.

---

## 💻 Tech Stack

| Frontend | Backend |
| :--- | :--- |
| **React 19** (Vite) | **Node.js** |
| **TailwindCSS v4** | **Express.js** |
| **React Router v7** | **MongoDB** & **Mongoose** |
| **Axios** (API Client) | **JSON Web Tokens** (Auth) |
| **Framer Motion** (Animations) | **Bcryptjs** (Security) |
| **Lucide React** (Icons) | **CORS** & **Dotenv** |

---

## 🗂️ Comprehensive File Structure & Architecture

Below is a complete breakdown of how the entire codebase is organized and what each file does.

### ⚙️ Backend (Node.js + Express + MongoDB)
The backend is a RESTful API serving the frontend.

*   **`backend/server.js`**: The main entry point. Initializes Express, configures CORS/JSON middleware, connects to MongoDB, and defines the base API routing paths.
*   **`backend/config/db.js`**: Handles the connection to the MongoDB database using Mongoose.
*   **`backend/models/`** *(Database Schemas)*
    *   `User.js`: Defines the user schema (name, email, password, role).
    *   `Project.js`: Defines the project schema (name, description, creator, members).
    *   `Task.js`: Defines the task schema (title, status, priority, due date, assigned users, project reference, and embedded comments array).
*   **`backend/middleware/`** *(Request Interceptors)*
    *   `auth.js`: Verifies the JWT sent in the `Authorization` header to protect private routes.
    *   `role.js`: Authorizes requests based on user roles (e.g., ensuring only "admins" can create projects).
*   **`backend/controllers/`** *(Business Logic)*
    *   `authController.js`: Handles user registration, password hashing, and login token generation.
    *   `projectController.js`: Logic for creating, updating, and fetching projects based on user roles.
    *   `taskController.js`: Logic for creating, updating, deleting tasks, and adding comments.
*   **`backend/routes/`** *(Endpoint Definitions)*
    *   `authRoutes.js`: Maps `/register` and `/login` to auth controllers.
    *   `projectRoutes.js`: Maps project CRUD operations, protected by auth/role middleware.
    *   `taskRoutes.js`: Maps task operations and comment endpoints.
    *   `userRoutes.js`: Endpoint to fetch the user directory for task/project assignments.

### 🎨 Frontend (React + Vite)
The frontend is a Single Page Application (SPA) providing the user interface.

*   **`frontend/index.html` & `frontend/src/main.jsx`**: The root HTML file and the React application entry point.
*   **`frontend/src/App.jsx`**: Configures `react-router-dom` to handle page navigation and route protection.
*   **`frontend/src/api/axios.js`**: Configures the Axios client with a base URL and an interceptor that automatically attaches the JWT to outgoing requests.
*   **`frontend/src/components/`** *(Reusable UI Elements)*
    *   `PrivateRoute.jsx`: A wrapper component that redirects unauthenticated users back to the login page.
    *   `Layout.jsx`: The main application shell featuring a responsive sidebar navigation and mobile header.
    *   `Navbar.jsx`: A simple top navigation bar with a logout function.
    *   `TaskModal.jsx`: A dynamic modal used for both creating new tasks and editing existing ones.
*   **`frontend/src/pages/`** *(Application Views)*
    *   `Login.jsx`: User authentication interface.
    *   `Register.jsx`: New user sign-up interface with validation.
    *   `Dashboard.jsx`: The home screen showing task statistics, recent tasks, and highlighting overdue items.
    *   `Projects.jsx`: A grid view of all accessible projects with an admin-only modal to create/edit projects and assign team members.
    *   `ProjectDetail.jsx`: The core Kanban board. Displays tasks in columns (To Do, In Progress, Done) and allows filtering, sorting, status updates, and commenting.

---

## 🚀 Getting Started

### Prerequisites
*   [Node.js](https://nodejs.org/) installed on your machine.
*   A running [MongoDB](https://www.mongodb.com/) database (Local or Atlas cluster).

### 1. Backend Setup
1.  Open a terminal and navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the backend directory and add the following variables:
    ```env
    PORT=5000
    MONGO_URL=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_jwt_key
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```
    The server will start on `http://localhost:5000`.

### 2. Frontend Setup
1.  Open a new terminal and navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the frontend directory:
    ```env
    VITE_API_URL=http://localhost:5000/api
    ```
4.  Start the Vite development server:
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:5173`.

---

## 📡 API Endpoints Summary

### Auth Endpoints (`/api/auth`)
*   **POST** `/register` - Register a new user account.
*   **POST** `/login` - Authenticate and retrieve a JWT.

### Project Endpoints (`/api/projects`)
*   **GET** `/` - Fetch projects (Admins see all; Members see assigned).
*   **POST** `/` - Create a new project (Admin only).
*   **PUT** `/:id` - Update a project (Admin only).

### Task Endpoints (`/api/tasks`)
*   **GET** `/` - Fetch tasks based on user role.
*   **POST** `/` - Create a new task.
*   **PUT** `/:id` - Update a task (Members can update status; Admins can update all).
*   **DELETE** `/:id` - Delete a task.
*   **POST** `/:id/comments` - Post a new comment to a task thread.

### User Endpoints (`/api/users`)
*   **GET** `/` - Retrieve a list of all users for assignment dropdowns.
