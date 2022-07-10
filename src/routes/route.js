const express = require('express');
const router = express.Router();

const UserController = require("../controllers/userController.js");
const ReviewController = require("../controllers/reviewController.js");
const BookController = require("../controllers/bookController.js");
const Middleware= require("../middleware/middleware.js")

router.post('/register', UserController.createUser);
router.post('/login', UserController.loginUser);

router.post('/books', BookController.createBooks);
router.get('/books', BookController.getBookDetails);
router.get('/books/:bookId', BookController.getBooksById);
router.put('/books/:bookId', BookController.updateBook);
router.delete('/books/:bookId', BookController.deleteById);
// router.delete('/books/:bookId',Middleware.authentication,Middleware.authorisation, BookController.deleteBookById);


router.post('/books/:bookId/review', ReviewController.createReviews);
router.put('/books/:bookId/review/:reviewId',/* Middleware.authentication,Middleware.authorisation */ ReviewController.updateReviews);
router.delete('/books/:bookId/review/:reviewId',/* Middleware.authentication,Middleware.authorisation */ ReviewController.deleteReview);








module.exports = router;