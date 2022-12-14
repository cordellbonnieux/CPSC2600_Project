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
      minlength: 5
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        validate: {
            validator: val => {
                if (!(/[A-Z]/.test(val))) {
                    return false
                }
                if (!(/\d/.test(val))) {
                    return false
                }
                if (!(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(val))) {
                    return false
                }
                return true
            },
            message: val => `password ${val.value} does not meet schema requirements`
        }
    },
    matchId: {
        type: String,
    },
    inMatch: {
        type: Boolean,
        default: false
    },
    created: {
        type: Date,
        default: () => Date.now(),
        required: [true, 'date is required'],
        immutable: true
    }
})

module.exports = mongoose.model('User', userSchema)