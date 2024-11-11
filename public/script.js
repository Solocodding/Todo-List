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
        // console.log(data);
        todoObject = data;
        lastId = Math.max(...Object.keys(todoObject).map(Number));
        // console.log(lastId);
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
            edit_check=true;
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
                    updateServer(todoObject);

                    el.replaceChild(preText, editInput);
                    BtnArea.replaceChild(editBtn, saveBtn);
                    edit_check=false;
                }
            });
        }

    });


    if (data.isStriked) {
        preText.classList.add("strikethrough");
    }

    let strikeBtn = document.createElement("button");
    strikeBtn.innerText = data.isStriked ? "Unstrike" : "Strike";
    data.isStriked ? editBtn.setAttribute('disabled', 'true') : editBtn.removeAttribute('disabled');
    strikeBtn.addEventListener("click", function () {

        data.isStriked = !data.isStriked;
        preText.classList.toggle("strikethrough");
        strikeBtn.innerText = data.isStriked ? "Unstrike" : "Strike";
        data.isStriked ? editBtn.setAttribute('disabled', 'true') : editBtn.removeAttribute('disabled');
        updateServer(todoObject);
    });

    let deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.addEventListener("click", function () {
        // deleteTodoFromUI(data.id);
        el.remove();
        data.isdeleted = true;
        updateServer(todoObject);
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
        todoObject[newItem.id] = newItem;
        updateServer(todoObject);
        displayTodoOnUI(newItem);
        inputField.value = "";
    }
});

inputField.addEventListener("keyup", () => {
    if (event.code === "Enter") {
        const msg = inputField.value.trim();
        if (msg !== "") {
            const newItem = createItem(msg);
            todoObject[newItem.id] = newItem;
            updateServer(todoObject);
            displayTodoOnUI(newItem);
            inputField.value = "";
        }
    }
})

function updateServer(todoObject) {
    fetch("http://localhost:9090/updateTodo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(todoObject)
    })
        .then(response => response.json())
        .then(data => console.log("Todo updated Successfully:", data))
        .catch(error => console.error("Error udating todo::", error));
}

function createItem(value) {
    return {
        Text: value,
        id: ++lastId,
        isStriked: false,
        isdeleted: false
    };
}
