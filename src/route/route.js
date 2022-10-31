const express = require('express');
const router = express.Router();


//....................Controllers
const userController = require("../controller/userController")
const taskController = require("../controller/taskController")
const Middleware = require("../middleware/middleware.js");


router.post("/user/register", userController.createUser)
router.post("/user/login", userController.logInUser)
router.post("/task",Middleware.authentication,taskController.addTask)
router.get("/task",Middleware.authentication, taskController.getAllTask)
router.put("/task/:taskId",Middleware.authentication,Middleware.authorisation, taskController.updateTask)
router.delete("/task/:taskId",Middleware.authentication,Middleware.authorisation, taskController.deleteTask)


 

module.exports = router;