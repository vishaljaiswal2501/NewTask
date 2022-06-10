const express = require('express');


const router = express.Router();

const BookController=require("../controller/mixController.js")
const MiddleWare=require("../middleware/middleware.js")
 
router.get('/test-me', function(req,res){
    res.send('my first ever api')
});

router.get('/basicCode',MiddleWare.mid1,  BookController.basicCode);


module.exports = router;
// adding this comment for no reason