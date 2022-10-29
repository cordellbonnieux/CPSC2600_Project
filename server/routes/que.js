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

queRoutes.post('/add', (req, res) => {
    const { user } = req
    Que.find({}).then(que => {
        let inQue = false
        for (let i = 0; i < que.userList.length; i++) {
            if (que.userList[i] === user) {
                inQue = true
            }
        }
        if (!inQue) {
            Que.userList = [...Que.userList, user]
            Que.save()
            inQue = true
        }
        res.send(inQue)
        res.status(200)
        res.end()
    })
})

module.exports = queRoutes