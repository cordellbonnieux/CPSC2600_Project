import nanoid from 'nanoid'
const mongoose = require('mongoose')

const sessionModel = new mongoose.Schema({
    userid: {
        type: String,
        required: true,
        immutable: true
    },
    lastActivity: {
        type: Date,
        default: () => Date.now(),
        required: true
    },
    created: {
        type: Date,
        default: () => Date.now(),
        required: true,
        immutable: true
    },
    sessionid: {
        type: String,
        required: true,
        immutable: true,
        default: () => nanoid()
    }
})

module.exports = mongoose.model('Session', sessionModel)