const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const taskSchema = new mongoose.Schema({
    taskName:
    {
        type: String,
        required: true,
        unique: true
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    userId: {
        type: ObjectId,
        ref: 'user'
    },

}, { timestamps: true })

module.exports = mongoose.model("task", taskSchema);