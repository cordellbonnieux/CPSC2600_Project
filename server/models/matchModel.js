const mongoose = require('mongoose')

const matchModel = new mongoose.Schema({
    player1: {
        type: [Object],
        required: true
        /* player credentials
            name
            _id
        */
    },
    player1_units: {
        type: [Object]
        /* stores the current state of units
            id
            type i.e class
            hp
            x
            y
            // unit stats stored on server by type, for now
            // later, add customizable names
        */
    },
    player1_turn: {
        type: [Object]
        /* records the state of units at the end of each turn
            number
            unit: [
                {
                    id
                    hp
                    x
                    y
                }
            ]
        */
    },
    player1_turns: {
        type: Number,
        default: 15
        // remaining player turns
    },
    player2: {
        type: [Object],
        required: true
        /* player credentials
            name
            _id
        */
    },
    player2_units: {
        type: [Object]
        /* stores the current state of units
            id
            type i.e class
            hp
            x
            y
            // unit stats stored on server by type, for now
            // later, add customizable names
        */
    },
    player2_turn: {
        type: [Object]
        /* records the state of units at the end of each turn
            number
            unit: [
                {
                    id
                    hp
                    x
                    y
                }
            ]
        */
    },
    player2_turns: {
        type: Number,
        default: 15
        // remaining player turns
    }

})

module.exports = mongoose.model('Match', matchModel)