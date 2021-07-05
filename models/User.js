const mongoose = require('mongoose')
const Schema = mongoose.Schema

//Create user schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    ic: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
})

module.exports = User = mongoose.model('user', UserSchema)