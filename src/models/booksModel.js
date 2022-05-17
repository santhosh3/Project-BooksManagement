const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const bookSchema = new mongoose.Schema({
    title: {
         type: String, 
         required: true, 
         unique: true 
        },
    excerpt: { 
         type: String, 
         required: true, 
        },
    userId: { 
         type: ObjectId, 
         ref: 'User', 
         required: true
        },
    ISBN: { 
         type: String, 
         required: true, 
         unique:true
        },
    category: { 
         type: String, 
         required:true
         },
    subcategory: [{
         type: String, 
         trim: true, 
         required: true 
        }],
    reviews: {
         type: Number, 
         required : true,
         default: 0 
        },
    deletedAt: Date, 
    isDeleted: { 
        type: Boolean, 
        default: false 
       },
    releasedAt: { 
        type: String, 
        required : true,
        default: null },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema) //books


