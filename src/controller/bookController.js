const bookModel = require("../model/bookModel.js")
const createBook = async function (req, res) {
  var data = req.body
  let savedData = await bookModel.create(data)
  res.send({ msg: savedData })
}
const booksList = async function (req, res) {
  let allBooks = await bookModel.find().select({bookName:1,authorName:1,_id:0})


  res.send({ msg: allBooks })
}
const getParticularBooks = async function (req, res) {
  let require=req.body
  let book = await bookModel.find({ $or:[{ bookName: "require.bookName" },{ tag:"require.tag" },{totalPages:"require.totalPages"}] })


  res.send({ msg: book })
}
const getXINRBooks = async function (req, res) {
  let INR = await bookModel.find({"prices.indianPrice": {$in:["100INR","200INR","500INR"]}})


  res.send({ msg:INR })
}
const getRandomBooks  = async function (req, res) {
  let bookpages = await bookModel.find({$or:[{totalPages:{"$gt":500}},{stockAvailable:true}]})


 return res.send({ msg: bookpages})
}
const getBooksInYear  = async function (req, res) {
  let getYear =req.body.Year

  let bookInYear = await bookModel.find({Year:getYear})


  res.send({ msg: bookInYear})
}

module.exports.createBook = createBook
module.exports.booksList = booksList
module.exports.getParticularBooks = getParticularBooks
module.exports.getXINRBooks = getXINRBooks
module.exports. getRandomBooks =  getRandomBooks
module.exports. getBooksInYear =  getBooksInYear