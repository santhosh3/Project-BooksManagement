const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true, 
    enum: ["Mr", "Mrs", "Miss"], 
    trim: true 
  },
  name: { 
    type: String, 
    required: "name is required", 
    trim: true 
  },
  phone: { 
    type: String, 
    required: "phone is required", 
    trim: true, 
    unique: true 
  },
  email: { 
    type: String, 
    required: "Email is required", 
    trim: true, 
    lowercase: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: "password is required", 
    minLength: 8, 
    maxLength: 15 
  },
  address: {
    street: { type: String },
    city: { type: String },
    pincode: { type: String }
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema) //users
