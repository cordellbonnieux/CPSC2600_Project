const mongoose = require('mongoose')

const queModel = new mongoose.Schema({
    userList: {
        type: [String],
        required: true,
    }
})

module.exports = mongoose.model('Que', queModel)