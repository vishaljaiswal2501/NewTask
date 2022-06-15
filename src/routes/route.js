const express = require('express');
const router = express.Router();
const userController= require("../controllers/userController")
const MiddleWare=require("../middleware/auth.js")
router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post("/users", userController.createUser)

router.post("/login", userController.loginUser)

//The userId is sent by front end
router.get("/users/:userId",MiddleWare.authenticate,MiddleWare.authorise,userController.getUserData)
router.post("/users/:userId/posts",MiddleWare.authenticate,MiddleWare.authorise,userController.postMessage)

router.put("/users/:userId",MiddleWare.authenticate,MiddleWare.authorise,userController.updateUser)
router.delete("/users/:userId",MiddleWare.authenticate,MiddleWare.authorise,userController.deleted)
// router.delete('/users/:userId', userController.deleteUser)

module.exports = router;