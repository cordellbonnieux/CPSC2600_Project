const express = require('express')
const matchRoutes = express.Router()
const Match = require('../models/matchModel')
const User = require('../models/userModel')
const { nanoid } = require('nanoid')

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

/*
* Get the current que
*/
/*
queRoutes.get('/get', (req, res) => {
    Que.find({}).then(que => {
        res.send(que)
        res.status(200)
        res.end()
    })
})
*/
/*
* Add user to que

queRoutes.post('/add', async function(req, res) {
    const { user } = req.body
    const que = await Que.findOne()

    if (!que.userList.includes(user)) {
        await Que.findOneAndUpdate(
            { '_id': que['_id'] },
            { userList: [...que.userList, user] },
            { new: true }
        ).then(() => res.send(true))
    } else {
        res.send(false)
    }
    res.status(200)
    res.end()
})
*/
/*
* Remove user to que

queRoutes.post('/remove', async function(req, res) {
    const { user } = req.body
    const que = await Que.findOne()

    if (!que.userList.includes(user)) {
        await Que.findOneAndUpdate(
            { '_id': que['_id'] },
            { userList: que.userList.filter(u => u !== user) },
            { new: true }
        ).then(() => res.send(true))
    } else {
        res.send(false)
    }
    res.status(200)
    res.end()
})
*/
module.exports = matchRoutes