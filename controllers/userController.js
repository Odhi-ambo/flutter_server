const connectDB = require("../config/db"); //import the connection


//get all users from DB
const getAllUsers = async (req, res, next) => {
  try {
    const [users] = await connectDB.query("SELECT * FROM users");

    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//get specific user from DB
const getAUser = async (req, res) => {
  try {
    const [user] = await connectDB.query(
      "SELECT * FROM users WHERE id = ?",
      [req.params.id]
    );
    if (user.length == 0) {
      res.status(500).send("User Not Found");
      return;
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// delete user from DB
const deleteAUser = async (req, res) => {
  try {
    const [user] = await connectDB.query(
      "DELETE FROM users WHERE id = ?",
      [req.params.id]
    );
    if (user.affectedRows == 0) {
      res.status(500).send("User Not Found");
      return;
    }
    res.status(200).send("deleted succesfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
};


const updateAUser = async (req, res) => {
  try {
    // Extract user_id from request parameters
    const { id } = req.params;
    // Extract new user details from request body
    const { fullname, email, phone, password } = req.body;

    // Prepare the SQL query and parameters
    let query = "UPDATE users SET ";
    let params = [];
    let counter = 0;

    if (fullname) {
      query += `fullname = ?`;
      params.push(fullname);
      counter++;
    }
    if (phone) {
      query += counter > 0 ? ", " : "";
      query += `phone = ?`;
      params.push(phone);
      counter++;
    }
    if (email) {
      query += counter > 0 ? ", " : "";
      query += `email = ?`;
      params.push(email);
      counter++;
    }
    if (password) {
      query += counter > 0 ? ", " : "";
      query += `password = ?`;
      params.push(password);
      counter++;
    }

    query += ` WHERE id = ?`;
    params.push(id);

    // Execute the update query
    const [user] = await connectDB.query(query, params);

    // Send a success response
    res.status(200).send(user);
  } catch (error) {
    // Send an error response
    res.status(500).send(error.message);
  }
};

// create userfrom DB
const registerAUser = async (req, res) => {
  //get data from user
  const { fullname, email, phone, password } = req.body;

  //ensure all data is sent
  if (!fullname || !email || !phone || !password) {
    res.status(404).send("Details missing");
    return;
  }

  //ensure no such user exists in the db
  const [user] = await connectDB.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  //if no such user exists result is zero
  if (user.length == 0) {
    try {

      const [user] = await connectDB.query(
        "INSERT INTO users (fullname, email, phone, password) VALUES ( ?, ?, ?, ?)",
        [fullname, email, phone, password]
      );
      res.status(200).send(user);
    } catch (error) {
      res.status(500).send(error.message);
    }
  } else {
    res.status(400).send("User already exists");
  }
};

const loginAUser = async (req, res) => {
  //get data from client
  const { email, password } = req.body;

  // console.log(req.body);

  //ensure we have the data we need
  if (!email || !password) {
    res.status(404).send("Email and password is required");
    return;
  }

  //ensure this user exists in the db
  const [user] = await connectDB.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  //if no user exists
  if (user.length == 0) {
    res.status(400).send("no such user exists");
  } else {
    try {
      // try to decrypt the password
      let db_pwd = user[0].password;

      if(db_pwd === password) {
        //send back the user to client
        const [user] = await connectDB.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
          );
          res.status(200).send(user[0]);
      } else {
        // No user found, send an error response
        res.status(401).send("Incorrect username or password");
      }
    } catch (error) {
      // Handle any errors that occur during the query
      res.status(500).send(error.message);
    }
  }
};

module.exports = {
  getAllUsers,
  getAUser,
  deleteAUser,
  registerAUser,
  updateAUser,
  loginAUser,
};