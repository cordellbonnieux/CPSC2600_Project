const express = require('express')
const accountRoutes = express.Router()
const User = require('../models/userModel')

/*
* Create a new user
*/
accountRoutes.route('/routes/user/create').post(function(req,res) {
    const { username, email, password } = req.body
    try {
        return new User({
            username,
            email,
            password,
            created: Date.now()
        }).save().then(() => {
            console.log('user:',username,'created.')
            res.send(username)
            res.status(200)
        })
    } catch (e) {
        console.log('createUser server error:', e.message)
        res.status(500)
    }
})

/*
* Check if user name exists
*/
accountRoutes.route('/routes/user/usernamename/exists').post(function(req,res) {
    const { user } = req.body
    User.find({}, function(err,result) {
        if (err) {
            console.log('checkifuserexists route error:', err.message)
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
accountRoutes.route('/routes/user/email/exists').post(function(req,res) {
    const { email } = req.body
    User.find({}, function(err,result) {
        if (err) {
            console.log('checkifemailexists route error:', err.message)
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
