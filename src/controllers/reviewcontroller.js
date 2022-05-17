const { default: mongoose } = require("mongoose")
const booksModel = require("../models/booksModel")
const reviewModel = require("../models/reviewModel")

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
}

const isValidRequestBody = function (body) {
    return Object.keys(body).length > 0
}

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

const validRating = function (rating) {
    if (rating < 1 || rating > 5) return false
    return true
}
const createReview = async function (req, res) {
    try {
        let body = req.body
        let bookId = req.params.bookId
        if (!isValidObjectId(bookId)) {
            return res.status(400).send({status:false, meassage:"Please enter valid bookId"})
        }
        let reviewBook = await booksModel.findOne({ isDeleted: false, _id: bookId })
        if (reviewBook == null) {
            return res.status(404).send({ status: false, message: "reviewBook is not found" })
        }
        if (!isValidRequestBody(body)) {
            return res.status(400).send({ status: false, message: "Invalid request parameters please provide user details" })
        }
        const { rating, isDeleted } = body
        if (isDeleted == true) {
            return res.status(400).send({ status: false, message: " Bad Request" })
        }
        if (!isValid(rating)) {
            return res.status(400).send({ status: false, message: " rating is required" })
        }
        if (!validRating(rating)) {
            return res.status(400).send({ status: false, message: " rating should be of proper length" })
        }
        req.body.reviewedAt = new Date()
        req.body.bookId = bookId
        const reviewing = await reviewModel.create(req.body)
        reviewBook.reviews = reviewBook.reviews + 1
        reviewBook.save()
        const finalReviewData = await reviewModel.findById(reviewing.id).populate('bookId');
        return res.status(201).send({ status: true, message: "created successfully", data: finalReviewData })
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

const reviewupdate = async function (req, res) {
    try {
        let id = req.params.bookId
        if(!isValidObjectId(id)) {
            return res.status(400).send({ status: false, message: "Enter a valid BookId" });
        }
        let check = await booksModel.findOne({ _id: id, isDeleted: false })
        if (!check) {
            return res.status(404).send({ status: false, msg: "book not found" })
        }
        let reviewid = req.params.reviewId
        if(!isValidObjectId(reviewid)) {
             return res.status(400).send({ status: false, message: "Enter a valid reviewId" });
        }
        let reviewed = await reviewModel.findOne({ _id: reviewid, bookId: id, isDeleted: false })
        if (!reviewed) {
            return res.status(404).send({ status: false, msg: "No such review exist in our DB" })
        }
        let reqbody = req.body
        if(!isValidRequestBody) {
            return res.status(400).send({status:false, message:"No parameters passed Please Enter the data"})
        }
        const { reviewedBy, rating, review } = reqbody
        const updateBlog = {}
        if (isValid(reviewedBy)) {
            updateBlog.reviewedBy = req.body.reviewedBy
        }
        if (isValid(rating)) {
            if (!validRating(rating)) {
                return res.status(200).send({ status: true, data: "Enter a Valid Rating (1 to 5)" })
            }
            updateBlog.rating = req.body.rating
        }
        if (isValid(review)) {
            updateBlog.review = req.body.review
        }
        updateBlog.reviewedAt = new Date()
        const updatereview = await reviewModel.findByIdAndUpdate(reviewid, updateBlog, { new: true })
        res.status(200).send({ status: true, data: updatereview })
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

const reviewDelete = async function (req, res) {
    try {
        let id = req.params.bookId
        if(!isValidObjectId(id)) {
            return res.status(400).send({ status: false, message: "Enter a valid Book id" })
        }
        let bookId = await booksModel.findById(id)
        if(!bookId) {
            return res.status(400).send({status:false, message:"Enter valid bookId"})
        }
        let reviewid = req.params.reviewId
        if(!isValidObjectId(reviewid)) {
            return res.status(400).send({ status: false, message: "Enter a valid reviewId" })
        }
        let reviewId = await reviewModel.findById(reviewid)
        if(!reviewId) {
            return res.status(400).send({status:false, message:"Enter valid bookId"})
        }
        let book = await booksModel.findOne({ _id: id, isDeleted: false })
        if (book == null) {
            return res.status(404).send({ status: false, msg: "No book found in DB" })
        }
        let reviewed = await reviewModel.findOne({ _id: reviewid, bookId: id, isDeleted: false })
        if (reviewed == null) {
            return res.status(404).send({ status: false, msg: "No such review exist in our DB" })
        }
         await reviewModel.findByIdAndUpdate(reviewid, { isDeleted: true }, { new: true })
         book.review = book.reviews === 0 ? 0 : book.review-1
         await book.save()

         res.status(200).send({ status: true, message: "Review deleted successfully" })
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports = { createReview, reviewupdate, reviewDelete }