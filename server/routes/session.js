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
    // find userid
    res.send('all good!')
    res.status(200)
    /*
    User.find({username:user}, function(err,res) {
        if (err) {
            console.log('sessionRoutes create error:', err.message)
            res.status(500)
            return null
        } else {
            console.log(res)
            //return res.userid // is this it???
            // make sure you get the id right
            return res // for now
        }
    }).then(id => {
        console.log('.then id read as:', id)
        if (id !== null) {
            const sessionid = nanoid()
            // create new session
            //const session = new Session({userid:id, sessionid:sessionid})
            // return session id in response
            res.send(id)
            res.status(200)
        }
    })
    */
})

module.exports = sessionRoutes