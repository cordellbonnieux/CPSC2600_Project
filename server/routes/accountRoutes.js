const express = require('express')
const accountRoutes = express.Router()
const { createUser } = require('../controllers/userController')

accountRoutes.route('/createuser').post(function(req,res) {
    const { username, email, password } = req.body
    createUser(username, email, password)
    res.send(`user ${username}, created.`)
    res.status(200)
})

module.exports = accountRoutes