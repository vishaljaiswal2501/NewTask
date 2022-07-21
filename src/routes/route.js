const express = require('express');
const {shortUrl,urlCode}=require('../controller/urlController')
const router = express.Router();

router.post("/url/shorten",shortUrl)

router.get("/:urlCode",urlCode)

router.all("/**", function(req,res){
    res.status(404).send({
        status:false,
        message:"the API you request not available"
    })
})


module.exports=router