const mongoose=require('mongoose')
const userSchema= new mongoose.Schema({
    bookName:String,
    authorName:String,
    Category:String,
    Year:Number



},{timestamps: true });
module.exports=mongoose.model('users',userSchema)