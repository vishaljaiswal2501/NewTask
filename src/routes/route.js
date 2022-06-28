const express = require('express');
const router = express.Router();
const AuthorController= require("../controllers/authorController")
const BlogController= require("../controllers/blogController")
const Middleware= require("../middleware/middleware.js")


router.post('/createAuthor', AuthorController.createAuthor)
router.post('/loginUser', AuthorController.loginUser)

router.post('/createblog',Middleware.authentication,BlogController.createblog)
router.delete('/deleteblog/:blogId',Middleware.authentication,Middleware.authorisation,BlogController.deleteBlogItem)
router.put('/blogs/:blogId',Middleware.authentication,Middleware.authorisation,BlogController.updateBlog)
router.delete('/delete/:blogId',Middleware.authentication,Middleware.authorisation, BlogController.deleteByQuery)
router.get('/filterblog',Middleware.authentication,BlogController.filterBlogs)






module.exports = router;