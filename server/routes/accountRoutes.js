const express = require('express')
const accountRoutes = express.Router()
const { connectViaMongoose, createUser, findUser } = require('../db/mongoose')

accountRoutes.route('/createuser').post(function(req,res) {
    const { username, email, password } = req.body
    connectViaMongoose()
    createUser(username, email, password)
})

module.exports = accountRoutes