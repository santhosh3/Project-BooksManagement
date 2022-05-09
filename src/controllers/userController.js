const userModel= require("../models/userModel")
const jwt=require("jsonwebtoken")

const isValid=function(value){
    if(typeof value==="undefined" || value===null)return false 
    if(typeof value==="string" && value.trim().length===0)return false 
    return true
}

const isValidTitle=function(title){
    title= title.trim()
    return ["Mr","Miss","Mrs"].indexOf(title)!==-1
}
const isValidRequestBody=function(body){
    return Object.keys(body).length>0 
}

const validPassword = function(password){
    if (password.length<=8 || password.length>=15)return false
    return true
      
}

const createUser= async function (req, res) {
    try {
        let body = req.body
        if(!isValidRequestBody(body)){
            return res.status(400).send({status:false,message:"Invalid request parameters please provide user details"})
        }
        
    
        const {title,name, phone, email,password,}=req.body
        if(!isValid(title)){
            return res.status(400).send({status:false,message:" title is required"})

        }
        
        if(!isValidTitle(title)){
            return res.status(400).send({status:false,message:"title can only be Mr, Ms , Mrs"})

        }
       
        if(!isValid(name)){
            return res.status(400).send({status:false,message:" name is required"})

        }
        if(!isValid(phone)){
            return res.status(400).send({status:false,message:"phone is required"})

        }


        if(!isValid(email)){
            return res.status(400).send({status:false,message:"Email is required"})

        }
        if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
           return res.status(400).send({status:false,message:"Email should be valid"})
        }
        if(!(/^[6-9]\d{9}$/.test(phone))){
            return res.status(400).send({status:false,message:"phone should be valid"})
        }
        if(!isValid(password)){
            return res.status(400).send({status:false,message:"Password is required"})
        }

            
            if(!validPassword(password)){
                return res.status(400).send({msg:"please type correct password"})

        }
        const isEmailPresent=await userModel.findOne({email:email})
        if(isEmailPresent){
            return res.status(409).send({status:false,message:"email address is already registered"})
        }
        const isPhonePresent=await userModel.findOne({phone:phone})
        if(isPhonePresent){
            return res.status(409).send({status:false,message:"phone is already registered"})
        }
        const user=await userModel.create(body)
        res.status(201).send({status:true,message:"created successfully",data:user})

  }
    catch (err) {
        
        res.status(500).send({ status:false, data: err.message })
    }

}

const loginUser=async function(req,res){
    try{
    let body=req.body 
    if(!isValidRequestBody(body)){
            return res.status(400).send({status:false,message:"Please provide login details"})
    }        
    let {email,password}=req.body
    if(!isValid(email)){
        return res.status(400).send({status:false,message:"Email is required"})

    }
    if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
        return res.status(400).send({status:false,message:"Email should be valid"})
     }
     if(!isValid(password)){
        return res.status(400).send({status:false,message:"Password is required"})

    }


    let data=await userModel.findOne({email:email,password:password})
    if(!data){
        res.status(400).send({status:false,message:"Invalid login credentials"})
    } 
    else{
        let token=jwt.sign({userId:data._id,batch:"uranium"},"Project3", {expiresIn:"30s"})
        res.status(200).send({status:true,data:{token:token}})

    }
}
catch(err){
    res.status(500).send({status:false,data:err.message})
}

}


const getUser=async function(req,res){
    try{
        console.log(1)
       

    //     const getUser=await userModel.find()
    //     if(getUser.length===0){
    //         return res.status(404).send({status:false,message:"No blogs found"})
    //     }
    //     return res.status(200).send({status:true,data:getBlogs})

        
     }
    catch(err){
        res.status(500).send({msg:err.message})
    }

}

// POST /login
// Allow an user to login with their email and password.
// On a successful login attempt return a JWT token contatining the userId, exp, iat. The response should be a JSON object like this
// If the credentials are incorrect return a suitable error message with a valid HTTP status code. The response should be a 
// JSON object like this

module.exports.createUser= createUser
module.exports.loginUser=loginUser
module.exports.getUser= getUser