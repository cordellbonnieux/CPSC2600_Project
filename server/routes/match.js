const express = require('express')
const matchRoutes = express.Router()
const Match = require('../models/matchModel')
const User = require('../models/userModel')
const { nanoid } = require('nanoid')

/*
*   THIS IS CURRENTLY NOT BEING USED
*/


matchRoutes.route('/create').post(async (req, res) => {
    const { user1, user2 } = req.body
    
    const player1 = await User.find({ username: user1 })
    const player2 = await User.find({ username: user2 })

    const match = await new Match({
        player1: {
            id: player1['_id'],
            name: player1.username
        },
        player2: {
            id: player2['_id'],
            name: player2.username
        }
    })

    await User.findOneAndUpdate(
        { _id: player1['_id'] },
        { matchId: match['_id'], inMatch: true }
    )

    await User.findOneAndUpdate(
        { _id: player2['_id'] },
        { matchId: match['_id'], inMatch: true }
    )

    res.send(match['_id'])
    res.status(200)
    res.end()
})

// not using this
matchRoutes.route('/end/:id').put(async (req, res) => {
    console.log(req.params.id, req.body.victor)
    const m = await Match.findOneAndUpdate({
        _id: req.params.id},
        {victor: req.body.victor, end: Date.now()
    })

    if (m) {
        const u = await User.updateMany(
            {matchId: req.params.id},
            {matchId: '', inMatch: false},
            (err) => err ? res.status(500) : null
        )

        if (u) {
            res.status(200)
        } else {
            res.status(500)
        }

    } else {
        res.status(500)
    }
})


module.exports = matchRoutes