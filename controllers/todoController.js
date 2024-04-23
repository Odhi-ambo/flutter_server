const connectDB = require("../config/db"); //import the connection

//get all todos from DB
const getAllTodos = async (req, res, next) => {
  try {
    const [todo] = await connectDB.query("SELECT * FROM todos");
    res.status(200).send(todo);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//get my todos from DB
const getMyTodos = async (req, res, next) => {
  try {
    const { owner_Email } = req.body;
    if(!owner_Email) {
        return res.status(401).send("Invalid User");
    }
    const [todo] = await connectDB.query(
      "SELECT * FROM todos WHERE owner_Email = ?",
      [owner_Email]
    );
    if (todo.length == 0) {
      res.status(500).send("Your Todos Not Found");
      return;
    }
    // Reverse the todos array so that latest comes first
    const reversedTodos = todo.reverse();
    res.status(200).send(reversedTodos);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//get specific todo from DB
const getATodo = async (req, res) => {
  try {
    const [todo] = await connectDB.query(
      "SELECT * FROM todos WHERE id = ?",
      [req.params.id]
    );
    if (todo.length == 0) {
      res.status(500).send("Todo Not Found");
      return;
    }
    res.status(200).send(todo);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// delete a todo from DB
const deleteATodo = async (req, res) => {
  try {
    const [todo] = await connectDB.query(
      "DELETE FROM todos WHERE id = ?",
      [req.params.id]
    );
    if (todo.affectedRows == 0) {
      res.status(500).send("todo Not Found");
      return;
    }
    res.status(200).send("deleted succesfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//This update method requires that all values are sent from body to database
const updateATodo = async (req, res) => {
  try {
    // Extract id from request parameters
    const { id } = req.params;
    // Extract new todo details from request body
    const {
      title,
      status,
      owner_Email,
    } = req.body;

    // Update the todo in the database
    const [todo] = await connectDB.query(
      "UPDATE todos SET title = ?, status = ?, owner_Email = ? WHERE id = ?",
      [
        title,
        status,
        owner_Email,
        id,
      ]
    );

    // Send a success response
    res.status(200).send(todo);
  } catch (error) {
    // Send an error response
    res.status(500).send(error.message);
  }
};

// create a todo
const createTodo = async (req, res) => {
  //get data from client
  const {
    title,
    status,
    owner_Email,
  } = req.body;

  //ensure all data is sent
  if (
    !title ||
    !status ||
    !owner_Email
  ) {
    res.status(404).send("Details missing");
    return;
  }

  try {
    const [todo] = await connectDB.query(
      "INSERT INTO todos (title, status, owner_Email) VALUES ( ?, ?, ?)",
      [
        title, status, owner_Email
      ]
    );
    res.status(200).send(todo);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  createTodo,
  getAllTodos,
  getMyTodos,
  getATodo,
  updateATodo,
  deleteATodo,
};