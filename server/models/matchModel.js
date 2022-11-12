const mongoose = require('mongoose')

const matchModel = new mongoose.Schema({
    start: {
        type: Date,
    },
    end: {
        type: Date
    },
    victor: {
        type: String
    },
    map: {
        type: String
    },
    mapData: {
        type: Object
    },
    player1: {
        type: Object,
        required: true
        /* player credentials
            name
            _id
            turn
            units[]
        */
    },
    player2: {
        type: Object,
        required: true
        /* player credentials
            name
            _id
            turn
            units[]
        */
    }
})

module.exports = mongoose.model('Match', matchModel)