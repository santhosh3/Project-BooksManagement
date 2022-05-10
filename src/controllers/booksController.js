const mongoose=require("mongoose")
const booksModel = require("../models/booksModel")
const userModel = require("../models/userModel")
var moment = require('moment')

const isValid=function(value){
    if(typeof value==="undefined" || value===null)return false 
    if(typeof value==="string" && value.trim().length===0)return false 
    return true
}
const isValidRequestBody=function(body){
    return Object.keys(body).length>0 
}
const isValidObjectId=function(objectId){
    return mongoose.Types.ObjectId.isValid(objectId)
}





const createBooks = async function (req, res) {
    try {
        let reqbody = req.body 
        
        if(!isValidRequestBody(reqbody)){
            return res.status(400).send({status:false,message:"Invalid request parameters please provide books details"})
        }
    
    const {title,excerpt,userId,ISBN,category,subcategory,releasedAt}=req.body 
    if(!isValid(title)){
        return res.status(400).send({status:false,message:"Title is required"})

    }
   
    if(!isValid(excerpt)){
        return res.status(400).send({status:false,message:"excerpt is required"})

    }
    if(!isValid(userId)){
        return res.status(400).send({status:false,message:"userId is required"})

    }
    if(!isValid(ISBN)){
        return res.status(400).send({status:false,message:"ISBN is required"})

    }
    if(!isValid(category)){
        return res.status(400).send({status:false,message:"Category  is required"})

    }
    if(!isValid(subcategory)){
        return res.status(400).send({status:false,message:"subcategory  is required"})

    }
  
    
    if(!isValidObjectId(userId)){
        return res.status(400).send({status:false,messgae:"Please provide valid userId"})
    }
   
    const user=await userModel.findById(userId)
    if(!user){
        return res.status(400).send({status:false,message:"User id not present"})
    }

    //  reqbody.releasedAt = new Date()
     console.log(3)
    // title= title.trim()
    const isTitle=await booksModel.findOne({title:title})
    if(isTitle){
        return res.status(409).send({status:false,message:"title address is already registered"})
    }
    // ISBN= ISBN.trim()
    const isISBN=await booksModel.findOne({ISBN:ISBN})
    if(isISBN){
        return res.status(409).send({status:false,message:"ISBN is already registered"})
    }
    console.log(4)

    const book=await booksModel.create({title,excerpt,userId,ISBN,category,subcategory,releasedAt:moment().format()
    })
      
    return res.status(201).send({status:true,message:"created successfully",data:book})
        
}
    catch (err) {
        
        return res.status(500).send({ status:false, error: err.message })
    }
}

const getBooks=async function(req,res){
    try{
        // const query={isDeleted:false,deletedAt:null,isPublished:true}
        const getQuery=req.query 
          console.log(getQuery)
          if(Object.keys(getQuery).length<=0 ){
            console.log(5)
            const bookDetails = await booksModel.find({isDeleted:false}).select({title:1,excerpt:1,userId:1,category:1,releasedAt:1})
            if(bookDetails.length<=0){  return res.status(404).send({status:false,message:"No book found"})}
            return res.status(200).send({status:true,message:"bookList" ,data:bookDetails})
        }

        if(isValidRequestBody(getQuery)){
            const {userId,category,subcategory}=getQuery 
            if(isValid(userId) && isValidObjectId(userId)){
                getQuery.userId=userId
            }
            if(isValid(category)){
                 getQuery.category=category.trim() 
            }
      
            if(isValid(subcategory)){
                const subcategoryArr=subcategory.split(',').map(x=>x.trim())
                getQuery.subcategory={$all:subcategoryArr}
            }
        }
        const getBooks1=await booksModel.find(getQuery).sort({title:1})
        if(getBooks1.length<=0){
            console.log(8)
            return res.status(404).send({status:false,message:"No Books found"})
        }
        return res.status(200).send({status:true,data:getBooks1})

        // users.sort((a, b) => a.firstname.localeCompare(b.firstname))


        
    }
    catch(err){
        res.status(500).send({msg:err.message})
    }

}

const getBooks1=async function(req,res){
    try{
        const getQuery=req.params.bookId 
          console.log(getQuery)
          if(Object.keys(getQuery).length>0 ){
            console.log(5)
            const bookDetails = await booksModel.findOne({isDeleted:false,_id:getQuery})
            if(bookDetails.length<=0){  return res.status(404).send({status:false,message:"No book found"})}
            bookDetails.reviewsData = 0
            return res.status(200).send({status:true,message:"bookList" ,data:bookDetails})
        }
 }
    catch(err){
        res.status(500).send({msg:err.message})
    }

}








// const updateBlogs=async function(req,res){
//     try{
//         const reqbody=req.body 
//         let id=req.params.blogId 
//         const authorToken=req.authorId
//         if(!isValidObjectId(id)){
//             return res.status(400).send({status:false,message:"Blog id is not valid"})
//         }
//         if(!isValidObjectId(authorToken)){
//             return res.status(400).send({status:false,message:"Author id is not valid"})
//         }
//         let blog=await blogsModel.findOne({_id:id,isDeleted:false,deletedAt:null})

//         if(!blog){ //if no data found then send error message
//             return res.status(404).send({status:false,data:"blog not present"})
//         }
//         if(blog.authorId.toString()!==authorToken){
//             return res.status(401).send({status:false,message:"Unauthorised access"})
//         }
//         if(!isValidRequestBody(reqbody)){
//             return res.status(200).send({status:true,message:"Blog unmodified",data:blog})
//         }
//         const {title,body,tags,category,subcategory,isPublished}=reqbody
//         const updateBlog={}
        
//         if(isValid(title)){
//             updateBlog.title=req.body.title
//         }
//         if(isValid(body)){
//             updateBlog.body=req.body.body
//         }
//         if(isValid(category)){
//             updateBlog.category=req.body.category
//         }
        
//         if(isValid(tags)){
//             let value=req.body.tags
            
//             let update1=updateBlog.tags
            
//             update1.push(value)
            
//             updateBlog.tags=update1 
            
//         }
    
//         if(isValid(subcategory)){
//             let value=req.body.subcategory
//             let update2=updateBlog.subcategory
//             update2.push(value)
//             updateBlog.subcategory=update2 
//         }
//         if(isPublished!==undefined){
//             updateBlog.isPublished=isPublished
//             updateBlog.publishedAt=isPublished?new Date():null;
//         }
    
        
//         const updateBlogs=await blogsModel.findOneAndUpdate({_id:id},updateBlog,{new:true})
        
//         res.status(200).send({status:true,data:updateBlogs})

//     }
//     catch(err){
//         res.status(500).send({status:false,msg:err.message})
//     }
// }

// const deleteId=async function(req,res){
//     try{
//         let id=req.params.blogId 
//         const authorToken=req.authorId
//         if(!isValidObjectId(id)){
//             return res.status(400).send({status:false,message:"Blog id is not valid"})
//         }
//         if(!isValidObjectId(authorToken)){
//             return res.status(400).send({status:false,message:"Author id is not valid"})
//         }
//         let blog=await blogsModel.findOne({_id:id,isDeleted:false,deletedAt:null})

//         if(!blog){ //if no data found then send error message
//             return res.status(404).send({status:false,data:"blog not present"})
//         }
//         if(blog.authorId.toString()!==authorToken){
//             return res.status(401).send({status:false,message:"Unauthorised access"})
//         }
//         await blogsModel.findOneAndUpdate({_id:id},{$set:{isDeleted:true,deletedAt:new Date()}})
//         return res.status(200).send({status:true,message:"Blog deleted succesfully"})
    
    
// }
// catch(err){
//     res.status(500).send({status:false,data:err.message})
// }
    
    

    

    
// }

// const deleteByQuery=async function(req,res){
//     try{
//     const query={isDeleted:false,deletedAt:null}
//     const filterQuery=req.query    
//     const authorToken=req.authorId
//     if(!isValidObjectId(authorToken)){
//         return res.status(400).send({status:false,message:"Author id is not valid"})
//     }
//     if(!isValidRequestBody(filterQuery)){
//         return res.status(400).send({status:false,message:"No query params passed"})
//     }
//     const{authorId,category,tags,subcategory,isPublished}=filterQuery
//     if(isValid(authorId) && isValidObjectId(authorId)){
//             query.authorId=authorId
//     }
//     if(isValid(category)){
//         query.category=category.trim()
//     }
//     if(isValid(isPublished)){
//         query.isPublished=isPublished
//     }
//     if(isValid(tags)){
//         const tagsArr=tags.trim().split(",").map(x=>x.trim())
//         query.tags={$all:tagsArr}
//     }
//     if(isValid(subcategory)){
//         const subcategoryArr=subcategory.trim().split(",").map(x=>x.trim())
//         query.subcategory={$all:subcategoryArr}
//     }
    
//     const blogs=await blogsModel.find(query)
//     if(blogs.length===0){
//         return res.status(404).send({status:false,message:"No blogs found"})
//     }
//     const blogsToBeDeleted=blogs.filter(x=>{if(x.authorId.toString()===authorToken) return x._id})
    
//     if(blogsToBeDeleted.length===0){
//         return res.status(404).send({status:false,message:"No blogs found"})
//     }
//     await blogsModel.updateMany({_id:{$in:blogsToBeDeleted}},{$set:{isDeleted:true,deletedAt:new Date()}})
//     return res.status(200).send({status:true,message:"Deleted successfully"})
//     }


// catch(err){
//     res.status(500).send({status:false,data:err.message})
// }
    

// }









module.exports.createBooks = createBooks
module.exports.getBooks=getBooks
module.exports.getBooks1=getBooks1



// module.exports.updateBlogs=updateBlogs
// module.exports.deleteId=deleteId
// module.exports.deleteByQuery=deleteByQuery
