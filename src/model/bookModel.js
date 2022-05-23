const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId


const bookSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String,
    },
    bookCover:{
        type:String,
        required:true,
    },
    excerpt: {
        type: String,
        required: true,
    },

    ISBN: {
        required: true,
        type: String,
        unique: true
    },
    userId: {
        required: true,
        type: ObjectId,
        ref: 'userers'
    },
    reviews: {
        type: Number,
        default: 0,
        required: true,

    },
    category: {
        type: String,
        require: true

    },
    subcategory: {
        type: [String],
        require: true
    },

    deletedAt: {
        type: Date,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false

    },
    releasedAt: {
        type: String,
        // default: Date.now(),
        required: true
    },



}, { timestamps: true });

module.exports = mongoose.model('Books', bookSchema)