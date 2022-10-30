const express = require('express')
const matchRoutes = express.Router()
const Match = require('../models/matchModel')
const { nanoid } = require('nanoid')

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