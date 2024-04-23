const express = require("express");
const router = express.Router();
const {
    createTodo,
    getAllTodos,
    getMyTodos,
    getATodo,
    updateATodo,
    deleteATodo,
} = require("../controllers/todoController");

router.get("/", getAllTodos); //Access all todos
router.post("/mine", getMyTodos); //Access my todos
router.get("/:id", getATodo); //Access specific todo
router.delete("/:id", deleteATodo); //delete todo
router.post("/", createTodo); //add a todo
router.put("/:id", updateATodo); //update todo

module.exports = router;