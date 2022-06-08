const AuthorModel = require("../authorModel/authorModel.js")
const BookModel = require("../bookModel/bookModel.js")
const createBook = async function (req, res) {
  var data = req.body
  let savedData = await BookModel.create(data)
  res.send({ msg: savedData })
}
const createAuthor = async function (req, res) {
  var data = req.body
  let authors =data.author_id

if(!authors){
  res.send({ msg: "without author_id no data wiil be submitted" })
}else
  var savedData= await AuthorModel.create(data)
  res.send({msg: savedData})
}

const getBookBychetanBhagat = async function (req, res) {
  let author = await AuthorModel.find({ author_name: "Chetan Bhagat" }).select(" author_id")
  let books = await BookModel.find({ author_id: author[0].author_id })

  res.send({ msg: books })
}
const bookAuthor = async function (req, res) {
 
  let data = await BookModel.findOneAndUpdate({name:"Two states"},{$set:{price: 100}},{new:true})
  let authorOfBook = await AuthorModel.find({author_id:data.author_id}).select({author_name:1})
  
  res.send({ msg:authorOfBook})
}
const getXINRBooks = async function (req, res) {
let INR=await BookModel.find({price:{ $gte: 50, $lte: 100} } ).select({ author_id :1})
let authorname=await AuthorModel.find({author_id:INR.map(x=>x.author_id)}).select({author_name:1})

  res.send({ msg: authorname})
}

module.exports.createBook = createBook
module.exports.createAuthor = createAuthor
module.exports.getBookBychetanBhagat = getBookBychetanBhagat
module.exports.bookAuthor = bookAuthor
module.exports.getXINRBooks = getXINRBooks
