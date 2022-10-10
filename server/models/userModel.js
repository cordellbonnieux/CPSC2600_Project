const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'username must be unique'],
        unique: true,
        minlength: 3
    },
    email: {
      type: String,
      required: [true, 'email must be unique'],
      unique: true,
      minlength: 7
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        validate: {
            validator: val => {
                if (!(/[A-Z]/.test(val))) {
                    console.log('password has no capital letters')
                    return false
                }
                if (!(/\d/.test(val))) {
                    console.log('password has no numbers')
                    return false
                }
                if (!(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(val))) {
                    console.log('password has no special chars')
                    return false
                }
                return true
            }
        }
    },
    created: {
        type: Date,
        default: () => Date.now(),
        required: [true, 'date is required'],
        immutable: true
    }
})

module.exports = mongoose.model('User', userSchema)