const express = require('express')
const queRoutes = express.Router()
const User = require('../models/userModel')
const Que = require('../models/queModel')
const { nanoid } = require('nanoid')

/*
* Get the current que
*/
queRoutes.get('/get', (req, res) => {
    console.log('getting a que!')
    Que.find({}).then(que => {
        res.send(que)
        res.status(200)
        res.end()
    })
})

module.exports = queRoutes