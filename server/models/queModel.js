const mongoose = require('mongoose')

const queModel = new mongoose.Schema({
    userList: {
        type: [String],
        required: true,
        immutable: true
    }
})

module.exports = mongoose.model('Que', queModel)