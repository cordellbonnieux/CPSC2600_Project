const express = require('express')
const queRoutes = express.Router()
const Que = require('../models/queModel')

/*
* Get the current que
*/
queRoutes.get('/', (req, res) => {
    Que.find({}).then(que => {
        res.send(que).status(200).end()
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
            { userList: [...que.userList, user] },
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
/*
* Remove user from que refactored
*/
queRoutes.delete('/:id', async function(req, res) {
    const que = await Que.findOne()
    if (que.userList.includes(req.params.id)) {
        await Que.findByIdAndUpdate(
            { '_id': que['_id'] },
            { userList: que.userList.filter(u => u !== req.params.id) },
            { new: true }
        ).then(() => res.send(true).status(200))
    } else {
        res.status(400).send(false)
    }
})

module.exports = queRoutes