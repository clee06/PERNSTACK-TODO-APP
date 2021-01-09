const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

const PORT = 5001;

// middleware
app.use(cors());
app.use(express.json());

// Set up ROUTES

// Create a todo 
app.post("/todos", async (req,res) => {
    try {
        const { description } = req.body;
        const newTodo = await pool.query(
            "INSERT INTO todo (description) VALUES($1) RETURNING *", 
            [description]
        );
        console.log("received new todo: " + req.body.description);
        res.json(newTodo.rows[0]) 
    } catch (err) {
        console.error(err.message);
    }
})

// Get all todos
app.get("/todos", async(req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM todo"); // get all data from todos table
        res.json(allTodos.rows);
    } catch (err) {
        console.error(err.message)
    }
})

// Get a specific TODO
app.get("/todos/:id", async (req, res) => {
    try {
        // console.log(req.params)
        const { id } = req.params;
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id])

        res.json(todo.rows[0])
        
    } catch (err) {
        console.error(err.message);
    }
})

// update a TODO

app.put("/todos/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;
        const updateTodo = await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2", 
        [description, id]
        );

        res.json("Todo was updated");

    } catch (err) {
        console.error(err.message)
    }
})

// Delete a Todo

app.delete("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [id]);
        res.json("Todo was deleted!");
    } catch (err) {
        console.log(err.message);
    }
})

app.listen(PORT, ()=> {
    console.log(`Server has started on ${PORT}`)
})