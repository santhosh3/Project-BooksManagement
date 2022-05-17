const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const reviewSchema = new mongoose.Schema({
  bookId: {
    type: ObjectId,
    ref: 'Book',
    required: true,
    trim: true
  },
  reviewedBy: {
    type: String,
    required: true,
    trim: true,
    default: "Guest"
  },
  reviewedAt: {
    type: Date,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    minLength: 1,
    maxLength: 5,
    required: true,
    trim: true
  },
  review: {
    type: String,
    trim: true
  },
  isDeleted: { type: Boolean, default: false },
}
);

module.exports = mongoose.model('Review', reviewSchema) 