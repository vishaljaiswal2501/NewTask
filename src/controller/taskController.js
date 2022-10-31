const TaskModel = require('../model/taskModel.js')

const { objectValue, forBody } = require('../validation/validation.js')

const addTask = async function (req, res) {
    try {
        if (!forBody(req.body)) {
            return res.status(400).send({ status: false, message: "Body should not remain empty" })
        };
        const { taskName, userId } = req.body;
        const data = {
            taskName,
            userId: req.UserIdNew
        };
        if (!objectValue(taskName))
            return res.status(400).send({ status: false, message: "taskName must be present" });

        const duplicateTask = await TaskModel.findOne({ taskName: data.taskName })
        if (duplicateTask) {
            return res.status(400).send({ status: false, msg: "this task is already exist" })
        }
        let savedTask = await TaskModel.create(data)
        res.status(201).send({ status: true, data: savedTask })
    }

    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

const getAllTask = async function (req, res) {
    try {
        const tasks = await TaskModel.find({ isDeleted: false })
        res.status(200).send({ status: true, data: tasks })
    }

    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }


}

const updateTask = async function (req, res) {
    try {
        if (!forBody(req.body)) {
            return res.status(400).send({ status: false, message: "Body should not remain empty" })
        };
        const TaskId = req.params.taskId

        let data = req.body
        if (!objectValue(data.taskName))
            return res.status(400).send({ status: false, message: "taskName must be present" });

        const task = await TaskModel.findOne({ _id: TaskId })
        if (!task || task.isDeleted == true) {
            res.status(400).send({ status: false, msg: "No Task exists from this TaskId" })
        }


        const updatedTask = await TaskModel.findOneAndUpdate({ _id: TaskId }, data, { new: true })
        res.status(200).send({ status: true, data: updatedTask })
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }

}


const deleteTask = async function (req, res) {
    try {
        const TaskId = req.params.taskId
        const task = await TaskModel.findById({ _id: TaskId })


        if (!task) {
            res.status(400).send({ status: false, msg: "No Task exists from this UserId" })
        }
        if (task.isDeleted == false) {
            const deletedTask = await TaskModel.findOneAndUpdate({ _id: TaskId }, { isDeleted: true })
            console.log(deletedTask)
            res.status(200).send({ status: true, msg: "task is deleted" })
        }
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }

}

module.exports.addTask = addTask
module.exports.getAllTask = getAllTask
module.exports.updateTask = updateTask
module.exports.deleteTask = deleteTask
