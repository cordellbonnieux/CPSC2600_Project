const express = require('express')
const accountRoutes = express.Router()
const { createUser, findUser } = require('../db/mongoose')

accountRoutes.route('/createuser').get(function(req,res) {
    const { username, email, password } = req.body
    createUser(username, email, password)
})

module.exports = accountRoutes