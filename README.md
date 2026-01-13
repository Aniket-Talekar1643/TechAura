# Project & Task Management App

A simple **MERN Stack Project & Task Management application** where users can:
- Login / Register
- Create projects
- Automatically move to tasks after project creation
- Create tasks under a specific project

---

## Tech Stack

- Frontend: React
- Backend: Node.js, Express.js
- Database: MongoDB (Mongoose)
- Authentication: JWT (Cookie-based)
- API Style: REST

---

## Folder Structure


---

## Authentication Flow

1. User logs in
2. JWT token is stored in HTTP-only cookies
3. All protected APIs use `verifyJWT` middleware
4. Only logged-in users can create projects and tasks

---

## Project → Task Flow (Important)

1. User creates a project
2. Project is saved in MongoDB
3. Backend returns `project._id`
4. Frontend saves `projectId` in state
5. App automatically navigates to **Tasks page**
6. Tasks are always loaded using `projectId`

To prevent errors, the Tasks page is **guarded** so it never loads with a `null` projectId.

---

## API Endpoints

### Project APIs
GET /api/projects
POST /api/projects
PUT /api/projects/:id
DELETE /api/projects/:id


### Task APIs


GET /api/projects/:projectId/tasks
POST /api/projects/:projectId/tasks
DELETE /api/tasks/:taskId


---

## How to Run the Project

### 1. Start MongoDB


mongod


### 2. Start Backend


cd backend
npm install
npm start


Server runs on:


http://localhost:5000


### 3. Start Frontend


cd frontend
npm install
npm start


Frontend runs on:


http://localhost:3000


---

## Usage Steps

1. Register a user
2. Login
3. Go to Projects page
4. Create a project (title must be at least 20 characters)
5. App automatically redirects to Tasks page
6. Create tasks under that project

---

## Known Issue Fixed

Previously, the Tasks page crashed because it loaded before `projectId` was set.

This was fixed by:
- Guarding the Tasks page
- Preventing API calls when `projectId` is null

---

## Future Improvements

- React Router navigation
- Edit / delete tasks
- UI styling
- Pagination
- Better error handling

---