const express = require('express')
const queRoutes = express.Router()
const User = require('../models/userModel')
const Que = require('../models/queModel')
const { nanoid } = require('nanoid')

/*
* Get the current que
*/
queRoutes.get('/get', (req, res) => {
    Que.find({}).then(que => {
        res.send(que)
        res.status(200)
        res.end()
    })
})

/*
* Add user to que
*/
queRoutes.post('/add', async function(req, res) {
    const { user } = req.body
    const que = await Que.findOne()

    if (!que.userList.includes(user)) {
        await Que.findOneAndUpdate(
            { '_id': que['_id'] },
            { userList: [...user.userList, user] },
            { new: true }
        ).then(() => res.send(true))
    } else {
        res.send(false)
    }
    res.status(200)
    res.end()
})

/*
* Remove user to que
*/
queRoutes.post('/remove', async function(req, res) {
    const { user } = req.body
    const que = await Que.findOne()

    // write here
    if (!que.userList.includes(user)) {
        que.userList = [...que.userList, user]
        await que.save()
        res.send(true)
    } else {
        res.send(false)
    }
    res.status(200)
    res.end()
})

module.exports = queRoutes