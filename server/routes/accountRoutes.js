const express = require('express')
const accountRoutes = express.Router()
const User = require('../models/userModel')

/*
* Create a new user
*/
accountRoutes.route('/createuser').post(function(req,res) {
    const { username, email, password } = req.body
    try {
        return new User({
            username,
            email,
            password,
            created: Date.now()
        }).save().then(() => {
            console.log('user:',username,'created.')
            res.send(`you've created user: ${username}.`)
            res.status(200)
        })
    } catch (e) {
        console.log('createUser server error:', e.message)
        res.status(500)
    }
})

/*
* Check if user exists
*/
accountRoutes.route('/checkifuserexists').post(function(req,res) {
    const { user } = req.body
    User.find({}, function(err,result) {
        if (err) {
            console.log('checkifuserexists route error:', e.message)
            res.status(500)
        } else {
            for (let i = 0; i < result.length; i++) {
                if (result[i].username === user) {
                    res.send(true)
                    res.status(200)
                    return
                }
            }
            res.send(false)
            res.status(200)        
        }
    })
})

/*
* Check if email exists
*/
accountRoutes.route('/checkifemailexists').post(function(req,res) {
    const { email } = req.body
    User.find({}, function(err,result) {
        if (err) {
            console.log('checkifemailexists route error:', e.message)
            res.status(500)
        } else {
            for (let i = 0; i < result.length; i++) {
                if (result[i].email === email) {
                    res.send(true)
                    res.status(200)
                    return
                }
            }
            res.send(false)
            res.status(200)        
        }
    })
})

module.exports = accountRoutes

/*
* create session token
*/
