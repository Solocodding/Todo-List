const saveBtn = document.getElementById("saveBtn");
const inputField = document.getElementById("inputField");
const todoList = document.getElementById("todoList");

let lastId = 0;
let todoObject = {}; // Initialize empty object

// Read todo data from server asynchronously
async function readtodofromServer() {
    try {
        const response = await fetch("http://localhost:9090");
        const data = await response.json();
        todoObject = data; // Assign the data fetched from the server
        lastId = Math.max(...Object.keys(todoObject).map(Number)); // Set lastId based on the highest existing id
        displayAllTodos();
    } catch (error) {
        console.error("Error reading data from server:", error);
    }
}

// Display all todos on the UI
function displayAllTodos() {
    Object.keys(todoObject).forEach(id => {
        if (!todoObject[id].isdeleted) {
            displayTodoOnUI(todoObject[id]);
        }
    });
}

// Display individual todo item
function displayTodoOnUI(todo) {
    const el = document.createElement("div");
    el.className = "todo-item";

    const preText = document.createElement("span");
    preText.innerText = todo.Text;
    preText.className = "todo-text";

    const editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.addEventListener("click", () => {
        // Edit functionality
    });

    const strikeBtn = document.createElement("button");
    strikeBtn.innerText = todo.isStriked ? "Unstrike" : "Strike";
    strikeBtn.addEventListener("click", () => {
        todo.isStriked = !todo.isStriked;
        preText.classList.toggle("strikethrough");
        strikeBtn.innerText = todo.isStriked ? "Unstrike" : "Strike";
        updateInStorage(todo.id, todo.Text, todo.isStriked);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.addEventListener("click", () => {
        deleteTodoFromUI(todo.id);
        delete todoObject[todo.id]; // Remove from local todoObject
        updateServer(todoObject); // Update on the server
    });

    el.appendChild(preText);
    el.appendChild(strikeBtn);
    el.appendChild(editBtn);
    el.appendChild(deleteBtn);
    todoList.appendChild(el);
}

// Add new todo
saveBtn.addEventListener("click", () => {
    const msg = inputField.value.trim();
    if (msg !== "") {
        const newItem = createItem(msg);
        appendTodo(newItem, newItem.id);
    }
});

// Create a new todo item
function createItem(value) {
    return {
        Text: value,
        id: ++lastId, // Increment lastId
        isStriked: false,
        isdeleted: false
    };
}

// Append todo item to the server and UI
function appendTodo(newItem, itemId) {
    todoObject[itemId] = newItem;
    updateServer(todoObject); // Update the server with the new todoObject
    displayTodoOnUI(newItem); // Display the new item on the UI
}

// Update todo data on the server
function updateServer(updatedTodo) {
    fetch("http://localhost:9090/updateTodo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updatedTodo })
    })
    .then(response => response.json())
    .then(data => console.log("Todo updated successfully:", data))
    .catch(error => console.error("Error updating todo:", error));
}

// Update todo item in the storage (client-side)
function updateInStorage(id, newText, isStriked) {
    if (todoObject[id]) {
        todoObject[id] = { ...todoObject[id], Text: newText, isStriked: isStriked };
    }
    updateServer(todoObject); // Sync with server
}

// Remove todo item from the UI
function deleteTodoFromUI(id) {
    const todoElement = document.getElementById(id);
    if (todoElement) {
        todoElement.remove();
    }
}

// Initialize the todo list by fetching data from the server
readtodofromServer();
