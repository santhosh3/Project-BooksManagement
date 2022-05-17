const userModel = require("../models/userModel")
const jwt_decode = require('jwt-decode');
const jwt = require("jsonwebtoken")
const booksModel = require("../models/booksModel");
const { findById } = require("../models/userModel");
const mongoose = require("mongoose")




const authenticate = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"] || req.headers["x-Api-key"]
        if (!token) {
            return res.status(403).send({ status: false, msg: "Token is required" })
        }
        var decoded = jwt_decode(token);
        var current_time = new Date().getTime() / 1000;
        if (current_time > decoded.exp) {
            return res.status(401).send({ status: false, msg: "Token has expired" })
        }
        let decodedToken = jwt.verify(token, 'Project3')
        if (!decodedToken) {
            return res.status(401).send({ status: false, msg: "please enter valid token" })
        }
        next()
    }
    catch (err) {
        if (err.name == 'TokenExpiredError') {
            return res.status(400).send({ status: false, msg: "token expired" })
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).send({ status: false, msg: "Invalid authentication" })
        }
        return res.status(500).send({ msg: err.message })
    }
}

const authorise1 = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        if (!token) return res.status(403).send({ status: false, msg: "Token is required" })
        let bookId = req.params.bookId
        if(!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).send({ status: false, msg: "Please Enter proper bookId" })
        }
        let validBook = await booksModel.findById(bookId)
        if (!validBook) {
            return res.status(400).send({ status: false, msg: "Book id is not valid" })
        }
        if (validBook.isDeleted == true) {
            return res.status(404).send({ status: false, msg: "This book does not Exist" })
        }
        var decoded = jwt_decode(token);
        var current_time = new Date().getTime() / 1000;
        if (current_time > decoded.exp) {
            return res.status(400).send({ status: false, msg: "Token has expired" })
        }
        let decodedToken = jwt.verify(token, 'Project3')
        if (!decodedToken) {
            return res.status(400).send({ status: false, msg: "Token is not present" })
        }
        console.log(decodedToken.userId + "    " + validBook.userId)
        if (decodedToken.userId != validBook.userId) {
            return res.status(403).send({ status: false, msg: "You are not Authorised" })
        }
        next()
    }
    catch (err) {
        if (err.name == 'TokenExpiredError') {
            return res.status(400).send({ status: false, msg: "token expired" })
        }
        if (err.name == 'JsonWebTokenError') {
            return res.status(401).send({ status: false, msg: "Invalid authentication" })
        }
        return res.status(500).send({ msg: err.message })
    }
}


module.exports = {authenticate, authorise1}



