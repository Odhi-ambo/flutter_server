const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getAUser,
  deleteAUser,
  registerAUser,
  updateAUser,
  loginAUser,
} = require("../controllers/userController");

router.get("/", getAllUsers); //Access all users /api/v1/users
router.get("/:id", getAUser); //Access specific user
router.delete("/:id", deleteAUser); //delete user  /api/v1/users/id
router.post("/", registerAUser); //add a user   /api/v1/users
router.post("/login", loginAUser); //login user /api/v1/users/login
router.put("/:id", updateAUser); //update user

module.exports = router;