const express = require('express');


const router = express.Router();
const bookModel=require("../bookModel/bookModel.js")
const authorModel=require("../authorModel/authorModel.js")
const BookController=require("../controller/mixController.js")
 
router.get('/test-me', function(req,res){
    res.send('my first ever api')
});
router.post('/createBook', BookController.createBook);
router.post('/createAuthor', BookController.createAuthor);
router.get('/getBookBychetanBhagat',BookController.getBookBychetanBhagat);
router.get('/bookAuthor',BookController.bookAuthor );
router.get('/getXINRBooks',BookController.getXINRBooks);


module.exports = router;
// adding this comment for no reason