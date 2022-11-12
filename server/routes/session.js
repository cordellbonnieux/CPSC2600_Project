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
sessionRoutes.route('/getUser').post(function(req,res) {
    const { sessionid } = req.body
    try {
        Session.find({sessionid: sessionid})
        .then(sessionRes => {
            if (sessionRes.length > 0) {

                // TODO:here also update the last login field

                User.find({_id: sessionRes[0].userid}) // userid as _id
                .then(userRes => {
                    if (userRes) {
                    const { email, username, inMatch, matchId } = userRes[0]
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
*/
/*
* Get User: refactored to check for lastActivity
* Returns a user account details for a given sessionid
*/
sessionRoutes.get('/:id', async function(req, res) {
    try {
        await Session.find({sessionid: req.params.id}).then(async function(sessionResponse) {
            // this variable is no equal to days
            const daysSinceActivity = (Date.now() - sessionResponse[0].lastActivity) / 86400000 //millisecondsInOneDay
            if (sessionResponse.length > 0 && daysSinceActivity < 50) {
                await User.find({_id: sessionResponse[0].userid}).then(userResponse => {
                    if (userResponse) {
                        res.send({
                            status: 'valid',
                            email: userResponse[0].email,
                            username: userResponse[0].username,
                            inMatch: userResponse[0].inMatch,
                            matchId: userResponse[0].matchId
                        }).status(200)
                    } else {
                        res.status(400).send('user not found')
                    }
                })
            } else {
                res.status(400).send('invalid session')
            }
        })
    } catch(e) {
        console.log('error in session/user:', e)
        res.status(500)
    }
})

/*
* delete session
* this route does not work
*/
sessionRoutes.delete('/:id', async function(req, res) {
    if(await Session.findOne({sessionid: req.params.id})) {
        await Session.deleteOne({sessionid: req.params.id}, (err, result) => {
            err ? 
                res.status(400).send(`session id:${req.params.id} does not exist`) :
                res.status(200).json(result)
        })
    }
    res.end()
})

/*
* TODO: update session.lastActivity each time App.js is loaded on client
*/

/*
* TODO:delete old sessions
*/

module.exports = sessionRoutes