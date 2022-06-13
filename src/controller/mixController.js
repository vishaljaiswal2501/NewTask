const User = require("../userdocument/user.js")
const Product= require("../productdocument/product.js")
const Order= require("../orderdocument/order.js")

const createProduct=async function(req,res){
  var data = req.body
  let savedData = await Product.create(data)
  res.send({msg:savedData})
}
const createUser=async function(req,res){
  
  var newHeader=req.headers.isfreeappuser
  if(!newHeader){
    res.send("isFreeAppUser is required")
  }else{  var data =req.body
  let savedData = await User.create(data)
  res.send({msg:savedData})}

}
const createOrder=async function(req,res){
var data=req.body
let savedData=await Order.create(data)
res.send({msg:savedData})
}


module.exports.createProduct=createProduct
module.exports.createUser=createUser
module.exports.createOrder=createOrder


