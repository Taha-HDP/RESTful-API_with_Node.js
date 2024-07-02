const express = require("express");
const router = express.Router();
const UserController = require("../http/controllers/user_Controller");
const auth = require("../http/middleware/auth");

//router.get("/api"  , UserController.getAllUsers);

//          /users?Page=...
router.get("/users" , auth , UserController.getAllUsers);
router.get("/users/:id" , auth , UserController.getUser);
router.get("/login" , UserController.login);

router.post("/users", UserController.createUser);

router.put("/users/:id" , auth , UserController.editUser);

router.delete("/users/:id" , auth , UserController.deleteUser);

module.exports = router;