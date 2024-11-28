const express = require("express");
const app = express();
const fs = require("fs");

app.use(express.static("public"));
app.use(express.json()); 

app.get("/data", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.sendFile(__dirname + "/userData.json", (err) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Error sending file" });
        }
    });
});

app.post("/updateTodo", (req, res) => {
    const updatedTodo = req.body;

    fs.readFile(__dirname + "/userData.json", "utf8", (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).json({ error: "Failed to read file" });
        }

        let todos = JSON.parse(data);
        todos[updatedTodo.id] = updatedTodo;

        fs.writeFile(__dirname + "/userData.json", JSON.stringify(todos, null, 2), (err) => {
            if (err) {
                console.error("Error writing to file:", err);
                return res.status(500).json({ error: "Failed to update todo" });
            }
            res.status(200).json({ message: "Todo updated successfully" });
        });
    });
});

app.post("/appendTodo", (req, res) => {
    const newTodo = req.body;

    fs.readFile(__dirname + "/userData.json", "utf8", (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).json({ error: "Failed to read file" });
        }

        let todos = JSON.parse(data);
        todos[newTodo.id] = newTodo;

        fs.writeFile(__dirname + "/userData.json", JSON.stringify(todos, null, 2), (err) => {
            if (err) {
                console.error("Error writing to file:", err);
                return res.status(500).json({ error: "Failed to append todo" });
            }
            res.status(200).json({ message: "Todo appended successfully" });
        });
    });
});

app.listen(9090, () => {
    console.log("Server Started on port 9090");
});
