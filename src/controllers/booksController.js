const mongoose = require("mongoose")
const booksModel = require("../models/booksModel")
const reviewModel = require("../models/reviewModel")
const userModel = require("../models/userModel")
var validateDate = require("validate-date");
const { getUser } = require("./userController")

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


        if(validateDate(releasedAt, responseType="boolean", dateFormat="yyyy/mm/dd")==false){
            return res.status(400).send({ status: false, message: "Enter the valid Date format YYYY/MM/DD" })
        }

        const isTitle = await booksModel.findOne({ title: title })
        if (isTitle) {
            return res.status(409).send({ status: false, message: "title address is already registered" })
        }
        
        const isISBN = await booksModel.findOne({ ISBN: ISBN })
        if (isISBN) {
            return res.status(409).send({ status: false, message: "ISBN is already registered" })
        }
      

        const book = await booksModel.create(req.body)

        return res.status(201).send({ status: true, message: "created successfully", data: book })

    }
    catch (err) {

        return res.status(500).send({ status: false, error: err.message })
    }
}

const getBooks = async function (req, res) {
    try {
        // const query={isDeleted:false,deletedAt:null,isPublished:true}
        const getQuery = req.query
        console.log(getQuery)
        if (Object.keys(getQuery).length == 0) {
        
            const bookDetails = await booksModel.find({ isDeleted: false }).select({ title: 1, excerpt: 1, userId: 1, reviews: 1, category: 1, releasedAt: 1 })
            if (bookDetails.length <= 0) { return res.status(404).send({ status: false, message: "No book found" }) }
            return res.status(200).send({ status: true, message: "bookList", data: bookDetails })
        }

        if (isValidRequestBody(getQuery)) {
            const { userId, category, subcategory } = getQuery
            if (isValid(userId) && isValidObjectId(userId)) {
                getQuery.userId = userId
            }
            if (isValid(category)) {
                getQuery.category = category.trim()
            }

            if (isValid(subcategory)) {
                const subcategoryArr = subcategory.split(',').map(x => x.trim())
                getQuery.subcategory = { $all: subcategoryArr }
            }
        }
        const getBooks1 = await booksModel.find(getQuery).sort({ title: 1 })
        if (getBooks1.length <= 0) {
   
            return res.status(404).send({ status: false, message: "No Books found" })
        }
        return res.status(200).send({ status: true, data: getBooks1 })

        // users.sort((a, b) => a.firstname.localeCompare(b.firstname))



    }
    catch (err) {
        res.status(500).send({ msg: err.message })
    }

}

const getBooksById = async function (req, res) {
    try {
        
            const bookId = req.params.bookId
       
            let bookDetails= await booksModel.findById(bookId).lean();
            
            let reviewData=await reviewModel.find({bookId:bookDetails._id,isDeleted:false})
                bookDetails.reviewsData=reviewData
                
            return res.status(200).send({ status: true, message: "bookList", data:bookDetails })
       
        }
    
    catch (err) {
        res.status(500).send({ msg: err.message })
    }}





// Update a book by changing its
// title
// excerpt
// release date
// ISBN
// Make sure the unique constraints are not violated when making the update




const updateBooks = async function (req, res) {
    try {

        let bookId = req.params.bookId
  
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
            updateBlog.releasedAt = releasedAt ? new Date() : null;
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

        let bookId = req.params.bookId
        const updateBooks = await booksModel.findByIdAndUpdate(bookId, {isDeleted:true, deletedAt:new Date()}, { new: true }, )
        const allReview=await reviewModel.updateMany({bookId:bookId,isDeleted:false},{isDeleted:true})

        res.status(200).send({ status: true, data: "Book is Deleted" })
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}



let testapi = function (req, res) {

    console.log(validateDate('2027/02/02', responseType="boolean", dateFormat="yyyy/mm/dd"))
}






module.exports={createBooks,getBooks,getBooksById,updateBooks,deleteBooks,testapi}


// module.exports.updateBlogs=updateBlogs
// module.exports.deleteId=deleteId
// module.exports.deleteByQuery=deleteByQuery
