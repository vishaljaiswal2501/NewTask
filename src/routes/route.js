const express = require('express');
const router = express.Router();

// ----------------------  ALL MODULES ARE REQUIRED HERE:

const UserController = require("../controllers/userController.js");
const ReviewController = require("../controllers/reviewController.js");
const BookController = require("../controllers/bookController.js");
const Middleware= require("../middleware/middleware.js");

//----------------------  USER API:

router.post('/register', UserController.createUser);
router.post('/login', UserController.loginUser);

//----------------------  BOOK API:

router.post('/books',  Middleware.authentication, Middleware.authorisation, BookController.createBooks);
router.get('/books', BookController.getBookDetails);
router.get('/books/:bookId', BookController.getBooksById);
router.put('/books/:bookId', Middleware.authentication, Middleware.authorisation, BookController.updateBook);
router.delete('/books/:bookId', Middleware.authentication, Middleware.authorisation, BookController.deleteById);

//----------------------  REVIEW API:

router.post('/books/:bookId/review', ReviewController.createReviews);
router.put('/books/:bookId/review/:reviewId', ReviewController.updateReviews);
router.delete('/books/:bookId/review/:reviewId',/* Middleware.authentication,Middleware.authorisation */ ReviewController.deleteReview);

module.exports = router;