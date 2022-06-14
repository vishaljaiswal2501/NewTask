const express = require('express');
const router = express.Router();
const userController= require("../controllers/userController")
const MiddleWare=require("../authentication/authen.js")

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post("/users", userController.createUser  )

router.post("/login", userController.loginUser)

//The userId is sent by front end
router.get("/users/:userId", userController.getUserData)

router.put("/users/:userId", userController.updateUser)
router.delete("/users/:userId", userController.deleted)
router.get("/user5/:userId",MiddleWare.mid1, userController.data)

module.exports = router;