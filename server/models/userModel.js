const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'username must be unique'],
        unique: true
    },
    email: {
      type: String,
      required: [true, 'email must be unique'],
      unique: true  
    },
    password: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        required: [true, 'date is required']
    }
})

module.exports = mongoose.model('User', userSchema)