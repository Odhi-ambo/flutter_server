const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const colors = require("colors");

//import local
const useRouter = require("./routes/userRouter");
const todoRouter = require("./routes/todoRouter");

// middlewares
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const PORT = process.env.PORT || 5000;

//routes
app.get("/", (req, res) => res.status(200).send("API RUNNING Succesfully"));
app.use("/api/v1/users", useRouter);
app.use("/api/v1/todos", todoRouter);

//global error handler
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send("Something went wrong!");
});

//first make sure db connection is successful
//then start the express server.
connectDB
  .query("SELECT 1")
  .then(() => {
    console.log("db connection  succeeded.".cyan);
    app.listen(PORT, () =>
      console.log(`server started at port ${PORT}`.yellow)
    );
  })
  .catch((err) => console.log("db connection failed. \n" + err));