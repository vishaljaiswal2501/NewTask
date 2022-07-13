const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');

const BookModel = require("../models/bookModel");
const UserModel = require("../models/userModel");

const { isValidObjectId, objectValue } = require('../validators/validation.js');

let authentication = function (req, res, next) {
    try {
        const bookId = req.params.bookId;

        if (bookId) {
            if (!mongoose.isValidObjectId(bookId))
                return res.status(400).send({ status: false, msg: "Please provide valid format for bookId" })
        }

        let token = req.headers["x-api-key"];

        if (!token) return res.status(400).send({ status: false, message: "Token Must be Present" })

        let decodedToken = jwt.verify(token, "Room-60-Radon");
        if (!decodedToken)
            return res.status(401).send({ status: false, message: "Token is invalid" })
        req.bookIdNew = decodedToken.userId

        next();
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

const authorisation = async function (req, res, next) {
    try {
        let userLoggedIn = req.bookIdNew

        let bookId = req.params.bookId
        let usersId = await BookModel.findOne({ _id: bookId }).select({ userId: 1, _id: 0 })
        if (!usersId) return res.status(400).send({ status: false, msg: 'Please enter valid book ID' })
        let newAuth = usersId.userId.valueOf()
        if (newAuth != userLoggedIn) return res.status(403).send({ status: false, msg: 'User logged is not allowed to modify the requested users data' })
        next()

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


module.exports.authentication = authentication;
module.exports.authorisation = authorisation;
