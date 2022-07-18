const express = require('express');
const {shortUrl,urlCode}=require('../controller/urlController')
const router = express.Router();

router.get("/test",(req,res)=>{
    res.send("Test")
})

router.post("/url/shorten",shortUrl)

router.get("/:urlCode",urlCode)







module.exports=router