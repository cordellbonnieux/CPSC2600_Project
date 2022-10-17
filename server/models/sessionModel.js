import nanoid from 'nanoid'
const mongoose = require('mongoose')

const sessionModel = new mongoose.Schema({
    sessionid: {
        type: String,
        required: true,
        immutable: true,
        default: () => nanoid()
    },
    userid: {
        type: String,
        required: true,
        immutable: true
    },
    start: {
        type: Date,
        default: () => Date.now(),
        required: true,
        immutable: true
    },
    lastActivity: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('Session', sessionModel)