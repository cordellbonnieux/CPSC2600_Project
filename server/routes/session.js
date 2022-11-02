const express = require('express')
const sessionRoutes = express.Router()
const Session = require('../models/sessionModel')
const User = require('../models/userModel')
const { nanoid } = require('nanoid')

/*
* create new session
* for given user and return a sessionid
*/
sessionRoutes.route('/create').post(function(req,res) {
    const { user } = req.body
    try {
        User.find({username:user})
        .then(data => {
            if (data.length > 0) {
                let userid = data[0]._id
                let sessionid = nanoid()
                if (data.length > 0) {
                    return new Session({
                        userid,
                        sessionid
                    }).save()
                    .then(() => {
                        res.send(sessionid)
                        res.status(200)
                    })
                } else {
                    console.log('session routes create error: no Users can be found.')
                    // if user cannot be found, don't create a session
                    res.send(null)
                    res.status(500)
                    return
                }
            } else {
                // if user cannot be found, don't create a session
                res.send(null)
                res.status(500)
            }
        })
    } catch (e) {
        // if user cannot be found, don't create a session
        console.log('session routes create error:', e)
        res.status(500)
    }
})

/*
* Get User 
* retrives the user details (sans password) for any given session id
*/
// TODO:refactor to get request
sessionRoutes.route('/getUser').post(function(req,res) {
    const { sessionid } = req.body
    try {
        Session.find({sessionid: sessionid})
        .then(sessionRes => {
            if (sessionRes) {

                // TODO:here also update the last login field

                User.find({_id: sessionRes[0].userid}) // userid as _id
                .then(userRes => {
                    if (userRes) {
                    const { email, username } = userRes[0]
                        res.send({
                            status:'valid',
                            email,
                            username,
                            inMatch,
                            matchId
                        })
                        res.status(200)
                    } else {
                        res.send({status:'user not found'})
                        res.status(200)
                    }
                })
            } else {
                res.send({status:'session not found'})
                res.status(200)
            }
        })
    } catch (e) {
        console.log('error in session/getuser:', e)
        res.status(500)
    }
})

/*
* delete session
*/


module.exports = sessionRoutes