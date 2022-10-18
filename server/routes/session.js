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

module.exports = sessionRoutes