const mongoose = require('mongoose')
const publisherSchema = new mongoose.Schema({
    author_id: Number,
    name: String,
    headQuarter: String

}, { timestamps: true });
module.exports = mongoose.model("newPublisher", publisherSchema)