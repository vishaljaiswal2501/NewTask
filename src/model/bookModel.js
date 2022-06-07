const mongoose=require('mongoose')
const userSchema= new mongoose.Schema({
    bookName:String,
    authorName:String,
    Year:{
        type:Number,
        default:2021
    },
    prices:{
        indianPrice:String,
        europeanPrice:String
    },
    tags:[String],
    totalPages:Number,
    stockAvailable:Boolean




},{timestamps: true });
module.exports=mongoose.model('vishal',userSchema)