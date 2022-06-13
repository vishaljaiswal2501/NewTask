const express = require('express');


const router = express.Router();

const OrderController=require("../controller/mixController.js")
const MiddleWare=require("../middlewaredocument/middleware.js")
 
router.get('/test-me', function(req,res){
    res.send('my first ever api')
});

router.post('/createProduct',OrderController.createProduct);
router.post('/createUser',OrderController.createUser);
router.post('/createOrder',MiddleWare.mid1,OrderController.createOrder);

module.exports = router;