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
    


    let data=await userModel.findOne({email:email,password:password})
    if(!data){
        return res.status(400).send({status:false,message:"Invalid login credentials"})
    } 
    else{
        let token=jwt.sign({userId:data._id,batch:"uranium"},"Project3", {expiresIn:"3000s"})
        let date = new Date()
        return res.status(200).send({status:true,data:{token:token,date}})

    }
}
catch(err){
    return res.status(500).send({status:false,data:err.message})
}

}


module.exports.createUser= createUser
module.exports.loginUser=loginUser
