const express = require('express')
const {createUser, loginUser, getUser , updateUserProfile} = require('../controller/userController')
const {createProduct , getProducts , getProductsByProductId , updateProduct , deleteProduct} = require('../controller/productController')
const {createCart, updateCart , getCart , deleteCart} = require('../controller/cartController')
const {authentication, authorization} = require('../middleware/auth')
const {createOrder , updateOrder} = require('../controller/orderController')
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
router.delete ('/products/:productId' , deleteProduct)

//Cart API

router.post('/users/:userId/cart' , authentication, authorization, createCart);
router.put('/users/:userId/cart' , authentication, authorization, updateCart);
router.get('/users/:userId/cart' , authentication, authorization, getCart);
router.delete('/users/:userId/cart' , authentication, authorization, deleteCart);

//Order API

router.post('/users/:userId/orders' , authentication , authorization , createOrder );
router.put('/users/:userId/orders' , authentication , authorization , updateOrder );


//Validating the endpoint
router.all("/*", function (req, res) {
    return res
      .status(404)
      .send({ status: false, message: "Page Not Found" });
});


module.exports = router

