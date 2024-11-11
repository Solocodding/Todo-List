const express=require("express");
const app=express();
const fs=require("fs");

app.use(express.static("public"));

app.get("/data", (req, res) => {
    // console.log("data")
    res.setHeader("Content-Type", "application/json");
    res.sendFile(__dirname + "/userData.json", (err) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Error sending file" });
        }
    });
});
app.post("/updateTodo", (req, res) => {
    let data = "";
    
    req.on("data", chunk => {
        data += chunk;
    });
    
    req.on("end", () => {
        fs.writeFile(__dirname + "/userData.json", data, (err) => {
            if (err) {
                console.error("Error writing to file:", err);
                res.status(500).json({ error: "Failed to write to file" });
            } else {
                res.status(200).json({ message: "Todo updated successfully" });
            }
        });
    });
});

app.listen(9090,()=>{
    console.log("Server Started");
})