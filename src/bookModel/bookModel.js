const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    // author_id:Number,
    name: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'newAuthor'
    },
    publisher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'newPublisher'
    },
    price: Number,
    ratings: Number,
    isHardCover:{
        type:Boolean,
        default:false
    }

}, { timestamps: true });
module.exports = mongoose.model("newBook", bookSchema)