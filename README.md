# TODO Application

A simple yet powerful task management, server-backed TODO list application that allows users to create, edit, delete, and mark tasks as complete. The project uses **Node.js** with **Express** for the backend, **file system (fs)** to handle data storage, and **HTML, CSS, and JavaScript** for the front end.

## Features

- **Create Tasks:** Add new tasks to the list with a simple input form.
- **Edit Tasks:** Edit existing tasks to update their details.
- **Check and Uncheck Tasks:** Mark tasks as complete or incomplete to track progress.
- **Delete Tasks:** Easily remove tasks from the list when no longer needed.
- **Responsive Design:** The app adapts to different screen sizes, making it usable on both mobile and desktop devices.
- **Data persistence** using a JSON file (`userData.json`) to save the state of the TODO list.

## Setup

### Prerequisites

- **Node.js** (version >= 12.0) installed on your system.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/todo-app.git
   cd todo-app

2. **Install dependencies**:
    ```bash
   npm install

3. **Run the application**:
    ```bash
    node app.js
4. **Open your browser and go to http://localhost:9090 to view the application.**

## Directory Structure

- **public:** Contains front-end files (index.html, style.css, script.js).
- **userData.json:** JSON file to store TODO data.
- **app.js:** Main server file to handle requests.
  
## Endpoints
- **GET /data:** Retrieves the current list of TODOs.
- **POST /updateTodo:** Updates the TODO list on the server with any changes made (create, edit, delete, strike).
## Frontend Functionality
The front-end is implemented in script.js and performs the following tasks:

- **Display all TODO** items retrieved from the server.
- **Update server** whenever the user adds, edits, deletes, or marks items as complete.
- **Input validation** to prevent empty TODO items from being added.
