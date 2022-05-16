const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    title: {
        type: String,
        enum: ["Mr", "Mrs", "Miss"],
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        require: true,
        type: String,
        unique: true
    },
    password: {
        require: true,
        type: String,

    },
    address: {
        street: { type: String },
        city: { type: String },
        pincode: { type: String }
    },

}, { timestamps: true });


module.exports = mongoose.model('userers', userSchema)