const mongoose = require('mongoose')

const matchModel = new mongoose.Schema({
    start: {
        type: Date,
        default: () => Date.now(),
        required: true
    },
    end: {
        type: Date,
        default: null,
    },
    victor: {
        type: String,
        default: null
    },
    map: {
        type: Object,
        required: true
    },
    updateNo: {
        type: Number,
        default: 0,
        required: true
    },
    player1: {
        type: Object,
        required: true
        /* player credentials
            name
            _id
            turn
            units[]
            etc
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
            etc
        */
    }
})

module.exports = mongoose.model('Match', matchModel)