const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const reviewSchema = new mongoose.Schema({
    bookId: {
        required: true,
        type: ObjectId,
        ref: 'Books'
    },
    reviewedBy: {
        type: String,
        required: true,
        default: "Guest"
    },
    reviewedAt: {
        type: Date,
        required: true,
        default: Date.now()
    },
    rating: {
        require: true,
        type: Number,
        Min: 1,
        max: 5
    },
    review: {
        optional: true,
        type: String,

    },
    isDeleted: {
        type: Boolean,
        default: false

    },

}, { timestamps: true });


module.exports = mongoose.model('reviewr', reviewSchema)