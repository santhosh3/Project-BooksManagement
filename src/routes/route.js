const express = require('express');
const router = express.Router();

const userController= require("../controllers/userController")
 const booksController= require("../controllers/booksController")
const middlewareController=require("../middleware/mid")



router.post("/register", userController.createUser) // User creation
router.post("/login",userController.loginUser)   //User login 

router.post("/books",middlewareController.authenticate,middlewareController.authorise1, booksController.createBooks) 
router.get("/books",middlewareController.authenticate,booksController.getBooks) 
router.get("/books/:bookId",middlewareController.authenticate,booksController.getBooks1) 




// router.post("/blogs",middlewareController.authenticate,blogsController.createBlogs) //creating blogs for the author who is logged in
//get all th blogs when the condition is satisfied which is passed in query params and which belongs to the same author who is logged in
// router.put("/blogs/:blogId",middlewareController.authenticate,blogsController.updateBlogs) // updating a blog when blogId is present in path params
// router.delete("/blogs/:blogId",middlewareController.authenticate,blogsController.deleteId)  //deleting a blog when blogId is present in path params 
// router.delete("/blogs",middlewareController.authenticate,blogsController.deleteByQuery) //deleting blogs when conditions are given in query params





module.exports = router;