const express = require('express')
const accountRoutes = express.Router()
const User = require('../models/userModel')

// TODO: refactor several of these to get requests or puts

/*
* Create a new user
*/
accountRoutes.route('/create').post(async function(req, res) {
    const { username, email, password } = req.body
    try {
        return await new User({
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
accountRoutes.route('/userexists').post((req, res) => {
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
accountRoutes.route('/emailexists').post((req, res) => {
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

/*
* Get email from username
*/
accountRoutes.route('/getemail').post((req, res) => {
    const { username } = req.body
    User.find({}, function(err,result) {
        if (err) {
            console.log('getemail route error:', err.message)
            res.status(500)
        } else {
            for (let i = 0; i < result.length; i++) {
                if (result[i].username === username) {
                    res.send(result[i].email)
                    res.status(200)
                    return
                }
            }
            res.send(`email for user "${username}" could not be found`)
            res.status(200)
        }
    })
})

/*
* Login
* Check if username matches password
*/
accountRoutes.route('/login').post((request, response) => {
    const { username, password } = request.body
    User.find({ username: username }, function(error, result) {
        if (error) {
            console.log('login to user error:', error.message)
            response.send(false)
            response.status(500)
        } else {
            if (result[0] !== undefined && result[0] !== null) {
                if (result[0].password === password) {
                    response.send({ result: 'valid' })
                } else {
                    // password does not match
                    response.send({ result: 'invalid password' })
                }
            } else {
                // user not found
                response.send({ result: 'invalid user' })
            }
            response.status(200)
        }
    })
})

module.exports = accountRoutes