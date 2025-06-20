# Buraq Manager Frontend

A simple Next.js frontend to test the Buraq Manager backend API.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- Create new tasks
- View all tasks
- Start tasks (change status to in_progress)
- Complete tasks (change status to completed)
- Delete tasks
- Real-time status updates

## API Endpoints Used

- `GET /api/v1/tasks` - Fetch all tasks
- `POST /api/v1/tasks/` - Create a new task
- `PUT /api/v1/tasks/{id}/start` - Start a task
- `PUT /api/v1/tasks/{id}/complete` - Complete a task
- `DELETE /api/v1/tasks/{id}` - Delete a task

## Prerequisites

Make sure your backend server is running on `http://localhost:8000` before using the frontend. 