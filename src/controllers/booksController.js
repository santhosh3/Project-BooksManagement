const mongoose = require("mongoose")
const booksModel = require("../models/booksModel")
const reviewModel = require("../models/reviewModel")
const userModel = require("../models/userModel")
const { getUser } = require("./userController")

const dateRegex = /((18|19|20)[0-9]{2}[\-.](0[13578]|1[02])[\-.](0[1-9]|[12][0-9]|3[01]))|(18|19|20)[0-9]{2}[\-.](0[469]|11)[\-.](0[1-9]|[12][0-9]|30)|(18|19|20)[0-9]{2}[\-.](02)[\-.](0[1-9]|1[0-9]|2[0-8])|(((18|19|20)(04|08|[2468][048]|[13579][26]))|2000)[\-.](02)[\-.]29/

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    if (typeof value === "number" && value.toString().trim.length === 0) return false
    return true
}
const isValidRequestBody = function (body) {
    return Object.keys(body).length > 0
}
const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

const createBooks = async function (req, res) {
    try {
        let reqbody = req.body
        if (!isValidRequestBody(reqbody)) {
            return res.status(400).send({ status: false, message: "Invalid request parameters please provide books details" })
        }
        const { title, excerpt, userId, ISBN, category,isDeleted, subcategory, releasedAt } = req.body
        if(isDeleted==true){
            return res.status(400).send({status:false,message:"Bad Request"})
        } 
        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: "Title is required" })
        }
        if (!isValid(excerpt)) {
            return res.status(400).send({ status: false, message: "excerpt is required" })
        }
        if (!isValid(userId)) {
            return res.status(400).send({ status: false, message: "userId is required" })
        }
        if (!isValid(ISBN)) {
            return res.status(400).send({ status: false, message: "ISBN is required" })
        }
        if (!isValid(category)) {
            return res.status(400).send({ status: false, message: "Category  is required" })
        }
        if (!isValid(subcategory)) {
            return res.status(400).send({ status: false, message: "subcategory  is required" })
        }
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, messgae: "Please provide valid userId" })
        }
        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(400).send({ status: false, message: "User id not present" })
        }
        if (!isValid(releasedAt)) {
            return res.status(400).send({ status: false, messgae: "Please provide valid released Date" })
        }
        if (!dateRegex.test(releasedAt)) {
            return res.status(400).send({status:false, message: "Release date must be in formate of YYYY-MM-DD"})
        }
        const isTitle = await booksModel.findOne({ title: title })
        if (isTitle) {
            return res.status(409).send({ status: false, message: "title address is already registered" })
        }
        const isISBN = await booksModel.findOne({ ISBN: ISBN })
        if (isISBN) {
            return res.status(409).send({ status: false, message: "ISBN is already registered" })
        }
        const book = await booksModel.create({title, excerpt, userId, ISBN, category, subcategory,releasedAt})
        return res.status(201).send({ status: true, message: "Book is created successfully", data: book })
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

const getBooks = async function (req, res) {
    try {
       const filterQuery = {isDeleted : false}
       const queryParams = req.query;
       
       if(isValidRequestBody(queryParams)) {
           const {userId, category,subcategory} = queryParams

       if(isValid(userId) && isValidObjectId(userId)) {
           filterQuery['userId'] = userId
       }
       if(isValid(category)) {
           filterQuery['category'] = category.trim()
       }
       if(isValid(subcategory)) {
           filterQuery['subcategory'] = subcategory.trim()
       }
    }
    const books = await booksModel.find(filterQuery).sort({title:1}).select("_id title excerpt userId category reviews releasedAt")

    if(Array.isArray(books) && books.length == 0) {
        return res.status(404).send({status:false, message: "books are not found"})
    }
    return res.status(200).send({status: true, message: "booklist", data : books})
}
    catch (err) {
        res.status(500).send({ msg: err.message })
    }
}

const getBooksById = async function (req, res) {
    try {
            const bookId = req.params.bookId
            if(!isValidObjectId(bookId)) {
                return res.status(400).send({status: false, message : 'The given booKId is not valid'})
            }
            let bookDetails= await booksModel.findById(bookId).lean();
            if(!bookDetails) {
                return res.status(400).send({status: false, message:'Book does not exit'})
            }
            let reviewData=await reviewModel.find({bookId:bookId,isDeleted:false})
                bookDetails.reviewsData=reviewData
            return res.status(200).send({ status: true, message: "bookList", data:bookDetails })
        }
    catch (err) {
        res.status(500).send({ msg: err.message })
    }
}

const updateBooks = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if(!isValidObjectId(bookId)) {
            return res.status(400).send({status: false, message : 'The given booKId is not valid'})
        }
        const { title, excerpt, releasedAt, ISBN } = req.body
        const updateBlog = {}
        if (isValid(title)) {
            updateBlog.title = req.body.title
        }
        if (isValid(excerpt)) {
            updateBlog.excerpt = req.body.excerpt
        }
        if (isValid(ISBN)) {
            updateBlog.ISBN = req.body.ISBN
        }
        if (releasedAt) {
            // updateBlog.releasedAt=releasedAt
            if (!isValid(releasedAt)) {
                return res.status(400).send({ status: false, messgae: "Please provide valid released Date" })
            }
            updateBlog.releasedAt = req.body.releasedAt;
        }
          //title
          let validtitle = await booksModel.findOne({ $and: [{ title: title }, { isDeleted: false }] })
            
          if(validtitle){
            return res.status(400).send({ msg: "title repeated" })
          }
          //ISBN
          let validISBN = await booksModel.findOne({ $and: [{ ISBN: ISBN }, { isDeleted: false }] })
          if(validISBN){
            return res.status(400).send({ msg: "ISBN repeated" })
          }
        const updateBooks = await booksModel.findByIdAndUpdate(bookId, updateBlog, { new: true })

        res.status(200).send({ status: true, data: updateBooks })
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

const deleteBooks = async function (req, res) {
    try {
        let params = req.params
        let bookId = params.bookId 
          await booksModel.findByIdAndUpdate(bookId, {isDeleted:true, deletedAt:new Date()}, { new: true }, )
          await reviewModel.updateMany({bookId:bookId,isDeleted:false},{isDeleted:true})
        res.status(200).send({ status: true, data: "Book is Deleted" })
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports={createBooks,getBooks,getBooksById,updateBooks,deleteBooks}

