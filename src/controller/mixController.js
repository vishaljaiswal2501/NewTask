const AuthorModel = require("../authorModel/authorModel.js")
const BookModel = require("../bookModel/bookModel.js")
const PublisherModel = require("../publisherModel/newpublisherModel.js")
const createBook = async function (req, res) {
  var data = req.body
  let savedData = await BookModel.create(data)
  res.send({msg: savedData })
}
const createAuthor = async function (req, res) {
  var data = req.body
  let savedData = await AuthorModel.create(data)
  res.send({msg:savedData})
}
const createPublisher = async function (req, res) {
  var data = req.body
  let savedData = await  PublisherModel.create(data)
  res.send({msg:savedData})
}
const getBookApi= async function(req,res){
  var data= req.body
  let author_me=data.author
  if(!author_me){
    res.send("author_me is required")
  }else
  var savedData=await BookModel.create(data)
  res.send({msg:savedData})


}
const validAuthorId= async function(req,res){
  var means= await AuthorModel.find().select({_id:1})
  var send=means[0].id
console.log(send)
var data =req.body
let author_me=data.author
console.log(author_me)
if(author_me!=send){
  
  res.send("author_id is invalid")
}
var savedData=await BookModel.create(data)
console.log(savedData)
res.send({msg:savedData})
 
}
const getBooksApi= async function(req,res){
  var data= req.body
  let publisher_me=data.publisher
  if(!publisher_me){
    res.send("publisher_me is required")
  }else
  var savedData=await BookModel.create(data)
  res.send({msg:savedData})


}
const validPublisherId= async function(req,res){
  var means= await PublisherModel.find().select({_id:1})
  var send=means[0].id
console.log(send)
var data =req.body
let publisher_me=data.publisher
console.log(publisher_me)
if(publisher_me!=send){
  
  res.send("publisher_id is invalid")
}
var savedData=await BookModel.create(data)
console.log(savedData)
res.send({msg:savedData})
 
}
const bothApiInBook=async function(req,res){
  var data= await BookModel.find().populate(["author","publisher"])
 res.send({msg:data})
}


module.exports.createBook = createBook
module.exports.createAuthor = createAuthor
module.exports.createPublisher = createPublisher
module.exports.getBookApi =getBookApi
module.exports.validAuthorId =validAuthorId
module.exports.getBooksApi =getBooksApi
module.exports.validPublisherId =validPublisherId
module.exports.bothApiInBook =bothApiInBook
// module.exports.getBookBychetanBhagat = getBookBychetanBhagat
// module.exports.bookAuthor = bookAuthor
// module.exports.getXINRBooks = getXINRBooks
// module.exports.getbooks = getbooks

