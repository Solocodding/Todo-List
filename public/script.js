const saveBtn = document.getElementById("saveBtn");
const todoList = document.getElementById("todoList");
const inputField = document.getElementById("inputField");

let lastId = 0;
let todoObject = {};
let edit_check = false;
readtodofromServer();

async function readtodofromServer() {
    try {
        const response = await fetch("http://localhost:9090/data");
        const data = await response.json();
        todoObject = data;
        // console.log(data);
        lastId = Math.max(...Object.keys(todoObject).map(Number), 1);
        displayAllTodos();
    }
    catch (error) {
        console.error("Error while reading data from server:", error);
    }
}

function displayAllTodos() {
    Object.keys(todoObject).forEach(id => {
        if (!todoObject[id].isdeleted) {
            displayTodoOnUI(todoObject[id]);
        }
    });
}

function displayTodoOnUI(data) {
    let el = document.createElement("div");
    el.className = "todo-item";

    let preText = document.createElement("span");
    preText.innerText = data.Text;
    preText.className = "todo-text";

    let BtnArea = document.createElement("span");
    BtnArea.className = "Btn-Area";

    let editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.addEventListener("click", function () {
        if (!edit_check) {
            edit_check = true;  //block other todo to edit
            strikeBtn.setAttribute('disabled', 'true');
            deleteBtn.setAttribute('disabled', 'true');

            let editInput = document.createElement("input");
            editInput.type = "text";
            editInput.className = "edit-input";
            editInput.value = preText.innerText;

            let saveBtn = document.createElement("button");
            saveBtn.innerText = "Save";

            el.replaceChild(editInput, preText);
            BtnArea.replaceChild(saveBtn, editBtn);
            editInput.focus();

            saveBtn.addEventListener("click", function () {
                let newValue = editInput.value.trim();
                if (newValue !== "") {
                    strikeBtn.removeAttribute('disabled');
                    deleteBtn.removeAttribute('disabled');
                    preText.innerText = newValue;
                    data.Text = newValue;
                    updateServer(data);
                    el.replaceChild(preText, editInput);
                    BtnArea.replaceChild(editBtn, saveBtn);
                    edit_check = false;
                }
            });
        }
    });

    let strikeBtn = document.createElement("button");
    strikeBtn.innerText = data.isStriked ? "Unstrike" : "Strike";
    data.isStriked ? editBtn.setAttribute('disabled', 'true') : editBtn.removeAttribute('disabled');
    strikeBtn.addEventListener("click", function () {
        data.isStriked = !data.isStriked;
        preText.classList.toggle("strikethrough");
        strikeBtn.innerText = data.isStriked ? "Unstrike" : "Strike";
        data.isStriked ? editBtn.setAttribute('disabled', 'true') : editBtn.removeAttribute('disabled');
        updateServer(data); 
    });

    let deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.addEventListener("click", function () {
        el.remove();
        data.isdeleted = true;
        updateServer(data);
    });

    BtnArea.appendChild(strikeBtn);
    BtnArea.appendChild(editBtn);
    BtnArea.appendChild(deleteBtn);

    el.appendChild(preText);
    el.appendChild(BtnArea);
    todoList.appendChild(el);
}

saveBtn.addEventListener("click", () => {
    const msg = inputField.value.trim();
    if (msg !== "") {
        const newItem = createItem(msg);
        appendTodo(newItem); 
        inputField.value = "";
    }
});

inputField.addEventListener("keyup", (event) => {
    if (event.code === "Enter") {
        const msg = inputField.value.trim();
        if (msg !== "") {
            const newItem = createItem(msg);
            appendTodo(newItem); 
            inputField.value = "";
        }
    }
});

function appendTodo(newItem) {
    fetch("http://localhost:9090/appendTodo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem)
    })
        .then(response => response.json())
        .then(data => {
            console.log("Todo appended successfully:", data);
            todoObject[newItem.id] = newItem;
            displayTodoOnUI(newItem);
        })
        .catch(error => console.error("Error appending todo:", error));
}

function updateServer(changedTodo) {
    fetch("http://localhost:9090/updateTodo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changedTodo)
    })
        .then(response => response.json())
        .then(data => console.log("Todo updated successfully:", data))
        .catch(error => console.error("Error updating todo:", error));
}

function createItem(value) {
    return {
        Text: value,
        id: ++lastId,
        isStriked: false,
        isdeleted: false
    };
}
