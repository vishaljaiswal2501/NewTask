const express = require('express')
const {createUser, loginUser, getUser , updateUserProfile} = require('../controller/userController')
const {createProduct , getProducts , getProductsByProductId , updateProduct} = require('../controller/productController')
const {authentication, authorization} = require('../middleware/auth')
const router = express.Router()

// User API
router.post('/register', createUser)
router.post('/login', loginUser)
router.get('/user/:userId/profile', authentication, authorization, getUser )
router.put('/user/:userId/profile', authentication , authorization , updateUserProfile)

//Product API

router.post('/products', createProduct)
router.get ('/products' , getProducts)
router.get ('/products/:productId' , getProductsByProductId)
router.put ('/products/:productId' , updateProduct)

//Validating the endpoint
router.all("/*", function (req, res) {
    return res
      .status(404)
      .send({ status: false, message: "Page Not Found" });
});


module.exports = router

