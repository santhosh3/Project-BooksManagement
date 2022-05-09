const userModel = require("../models/userModel")

let jwt=require("jsonwebtoken")

const authenticate=async function(req,res,next){
    try{
       
        let token = req.headers["x-api-key"]
        
        if(!token) return res.status(403).send({status:false,msg:"Token is required"})
        
        let decodedToken = jwt.verify(token, 'Project3')
        
        if(!decodedToken){
            
                res.send("msg")      
        }
        next()
    }
       

catch(err){
    return res.status(500).send({msg:err.message})
}


}



module.exports.authenticate=authenticate

