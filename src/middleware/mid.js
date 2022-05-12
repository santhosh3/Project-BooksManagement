const userModel = require("../models/userModel")
const jwt_decode = require('jwt-decode');
const jwt=require("jsonwebtoken")
const booksModel = require("../models/booksModel");
const { findById } = require("../models/userModel");

const authenticate=async function(req,res,next){
    try{
       
        let token = req.headers["x-api-key"]
        
        if(!token) return res.status(403).send({status:false,msg:"Token is required"})
        
        var decoded = jwt_decode(token);
        var current_time = new Date().getTime() / 1000;
        if (current_time > decoded.exp) {
            return res.status(400).send({status:false ,msg:"Token has expired"})
          }
 
        
        let decodedToken = jwt.verify(token, 'Project3' )
        if(!decodedToken){
            return res.status(400).send({status:false ,msg:"Token is not"})   
        }
    
   
         next()
        
    }
       

catch(err){
    return res.status(500).send({msg:err.message})
}


}
const authorise1=async function(req,res,next){
    try{
        let token = req.headers["x-api-key"]
        
        if(!token) return res.status(403).send({status:false,msg:"Token is required"})
        
        let bookId=req.params.bookId
        let validBook=await booksModel.findById(bookId)

        if(!validBook)
        {
            return res.status(400).send({status:false ,msg:"Book id is not valid"})
        }
        if(validBook.isDeleted==true){
            return res.status(404).send({status:false ,msg:"This book does not Exist"})
        }

        var decoded = jwt_decode(token);
        var current_time = new Date().getTime() / 1000;
        if (current_time > decoded.exp) {
            return res.status(400).send({status:false ,msg:"Token has expired"})
          }

 
        
        let decodedToken = jwt.verify(token, 'Project3' )
        if(!decodedToken){
            return res.status(400).send({status:false ,msg:"Token is not"})   
        }
        console.log(decodedToken.userId+"    "+validBook.userId)
        if(decodedToken.userId!=validBook.userId){
            return res.status(403).send({status:false ,msg:"You are not Authorised"})
        }
       
   
        next()
    }
            
catch(err){
    return res.status(500).send({msg:err.message})
}}

        
const authorise2=async function(req,res,next){
    try{
        let token=req.headers["x-api-key"]
        let decodedToken=jwt.verify(token,"Project3")
        
             let match = req.params.bookId
            let bookID = await booksModel.findById(match).select({userId:1})
         let data=decodedToken.userId //we are fetching userid
        // let userID=req.body.userId   //get the userId from req.body for post api
        if(bookID){  
            if(data==bookID.userId){
                
                next()
            }
            else{
                return res.status(403).send({msg:"cannot access other's account"})

        
            }}}
            
catch(err){
    return res.status(500).send({msg:err.message})
}}

               
        



module.exports.authenticate=authenticate
module.exports.authorise1=authorise1
module.exports.authorise2=authorise2

