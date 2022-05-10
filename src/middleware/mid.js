const userModel = require("../models/userModel")

let jwt=require("jsonwebtoken")

const authenticate=async function(req,res,next){
    try{
       
        let token = req.headers["x-api-key"]
        
        if(!token) return res.status(403).send({status:false,msg:"Token is required"})
         let data;
        let decodedToken = jwt.verify(token, 'Project3', function(err, value){
            if(err){
                // res.status(400).send({msg:err})
            }
            else{
                data=value
            }
        
        }     )
    console.log(data  )
    if(!data){
       return res.status(400).send({status:false ,msg:"Token has expired"})
    }
    next()
        
        // if(!decodedToken){
            
        //         res.send("msg")      
        // }
   
    }
       

catch(err){
    return res.status(500).send({msg:err.message})
}


}
const authorise1=async function(req,res,next){
    try{
        let token=req.headers["x-api-key"]
        let decodedToken=jwt.verify(token,"Project3")
        
        
        let data=decodedToken.userId //we are fetching userid
        let userID=req.body.userId   //get the userId from req.body for post api
        if(userID){  
            if(data==userID){
                
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

