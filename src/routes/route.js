const express = require('express');
const router = express.Router();

const userController= require("../controllers/userController")
 const booksController= require("../controllers/booksController")
const middlewareController=require("../middleware/mid")
const reviewController= require("../controllers/reviewController")


//User  API
router.post("/register", userController.createUser) // User creation
router.post("/login",userController.loginUser)   //User login 


//Books API
router.post("/books",middlewareController.authenticate, booksController.createBooks) 
router.get("/books",middlewareController.authenticate,booksController.getBooks) 
router.get("/books/:bookId",middlewareController.authenticate,booksController.getBooksById) 
router.put("/books/:bookId", middlewareController.authorise1,booksController.updateBooks)
router.delete("/books/:bookId", middlewareController.authorise1,booksController.deleteBooks)

//Review APIs
router.post("/books/:bookId/review",reviewController.createReview)
router.put("/books/:bookId/review/:reviewId",reviewController.reviewupdate)
router.delete("/books/:bookId/review/:reviewId",reviewController.reviewDelete)











module.exports = router;