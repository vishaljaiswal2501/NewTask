const UserModel = require('../model/userModel.js')
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken");
const TaskModel = require('../model/taskModel.js')


const authentication = async function (req, res, next) {
    try {
        const taskId = req.params.taskId;

        if (taskId) {
            if (!mongoose.isValidObjectId(taskId))
                return res.status(400).send({ status: false, msg: "Please provide valid format for taskId" })
        }

        let token = req.headers["x-api-key"];

        if (!token) return res.status(400).send({ status: false, message: "Token Must be Present" })

        let decodedToken = jwt.verify(token, "task");
        console.log(decodedToken)
        if (!decodedToken)
            return res.status(401).send({ status: false, message: "Token is invalid" })
        req.UserIdNew = decodedToken.userId

        next();
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

const authorisation = async function (req, res, next) {
    try {
        let userLoggedIn = req.UserIdNew

        let taskId = req.params.taskId
        let task = await TaskModel.findOne({ _id: taskId }).select({ userId: 1, _id: 0 })

        if (!task) {
            return res.status(400).send({ status: false, msg: 'Please enter valid task ID' })
        }
        let newAuth = task.userId.valueOf()

        if (newAuth != userLoggedIn) return res.status(403).send({ status: false, msg: 'User logged is not allowed to modify the requested users data' })

        next();

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


module.exports.authentication = authentication;
module.exports.authorisation = authorisation;