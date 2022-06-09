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
router.post('/createPublisher', BookController.createPublisher);
router.post('/getBookApi', BookController.getBookApi);
router.post('/validAuthorId', BookController.validAuthorId);
router.post('/validPublisherId', BookController.validPublisherId);
router.get('/bothApiInBook', BookController.bothApiInBook);
// router.get('/getBookBychetanBhagat',BookController.getBookBychetanBhagat);
// router.get('/bookAuthor',BookController.bookAuthor );
// router.get('/getXINRBooks',BookController.getXINRBooks);
// router.get('/getbooks',BookController.getbooks);


module.exports = router;
// adding this comment for no reason