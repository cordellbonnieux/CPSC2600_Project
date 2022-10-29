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

queRoutes.post('/add', async function(req, res) {
    const { user } = req
    const que = await Que.findOne()

    if (!que.userList.includes(user)) {
        que.userList = [...que.userList, user]
        await que.save()
        res.send(true)
    } else {
        res.send(false)
    }
    res.status(200)
    res.end()

/*

    Que.find({}).then(async function(que) {
        let inQue = false
        for (let i = 0; i < que[0].userList.length; i++) {
            if (que[0].userList[i] === user) {
                inQue = true
            }
        }
        if (!inQue) {
            //que[0].userList = [...que[0].userList, user]
            //que[0].save()
            await Que.updateOne(
                {userList: que[0].userList},
                {userList: [...que[0].userList, user]}
            ).then(() => {
                inQue = true
                console.log()
            })
        }
        res.send(inQue)
        res.status(200)
        res.end()
    })
    */
})

module.exports = queRoutes