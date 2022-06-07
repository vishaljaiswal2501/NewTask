const express = require('express');


const router = express.Router();
const bookModel=require("../model/bookModel.js")
const BookController=require("../controller/bookController.js")
 
router.get('/test-me', function(req,res){
    res.send('my first ever api')
});
router.post('/createBook', BookController.createBook);
router.get('/bookList',BookController.booksList);
router.get('/getParticularBooks',BookController.getParticularBooks);
router.get('/getXINRBooks',BookController.getXINRBooks);
router.get('/getRandomBooks',BookController.getRandomBooks);
router.get('/getBooksInYear',BookController.getBooksInYear);

module.exports = router;
// adding this comment for no reason