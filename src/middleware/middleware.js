const jwt = require("jsonwebtoken");

const mongoose = require('mongoose');

const BookModel = require("../models/bookModel")
let authentication = function (req, res, next) {
    try{
        const bookId=req.params.bookId;
        console.log(bookId)
    //     if(bookId){
    //     if(!mongoose.isValidObjectId(bookId)) return res.status(400).send({status:false,msg:"please provide valid format for bookId"})
    //    }
        let token = req.headers["x-api-key"];

        
    if (!token) return res.status(400).send({ status: false, msg: "Token Must be Present" })

    let decodedToken = jwt.verify(token, "Room-60-Radon");
    if (!decodedToken)
        return res.status(401).send({ status: false, msg: "token is invalid" })
        req.bookIdNew = decodedToken.userId

    next()
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

const authorisation = async function (req, res, next) {
    try{
    let userLoggedIn = req.bookIdNew

  
        let bookId = req.params.bookId
        
        let userId = await BookModel.findOne({ _id: bookId }).select({ userId: 1, _id: 0 })
        if(!userId) return res.status(403).send({ status: false, msg: 'Please enter valid blog ID' })
        let newAuth = userId.userId.valueOf()
        console.log(newAuth)
        if (newAuth != userLoggedIn) return res.send({ status: false, msg: 'User logged is not allowed to modify the requested users data' })
    
    next()
}catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports.authentication=authentication
module.exports.authorisation=authorisation
