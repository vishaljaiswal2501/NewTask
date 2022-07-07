const express = require('express');
const router = express.Router();

const UserController = require("../controllers/userController.js");
const BookController = require("../controllers/bookController.js");
const ReviewController = require("../controllers/reviewController.js");


router.post('/register', UserController.createUser)
router.post('/books', BookController.createBooks);
router.post('/books/:bookId/review', ReviewController.createReviews)
router.get('/books', BookController.getBookDetails);
router.get('/books/:bookId', BookController.getBooksById)
router.post('/login', UserController.loginUser)
router.put('/books/:bookId', BookController.updateBook)

module.exports = router;