const express = require('express')
const sessionRoutes = express.Router()
const Session = require('../models/sessionModel')
const User = require('../models/userModel')
const { nanoid } = require('nanoid')

/*
* create new session
* for given user and return a sessionid
*/
sessionRoutes.route('/create').post(async function(req,res) {
    const { user } = req.body
    await User.find({username:user})
    .then(async function(data) {
        if (data.length > 0) {
            let userid = data[0]._id
            let sessionid = nanoid()
            if (data.length > 0) {
                return await new Session({
                    userid,
                    sessionid
                }).save()
                .then(() => {
                    res.send(sessionid)
                    res.status(200)
                })
                .catch(err => res.status(500))
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
    .catch(err => res.status(500))
})

/*
* Get User: refactored to check for lastActivity
* Returns a user account details for a given sessionid
sessionRoutes.get('/:id', async function(req, res) {
    try {
        await Session.find({sessionid: req.params.id}).then(async function(sessionResponse) {
            // this variable is no equal to days
            //const daysSinceActivity = (Date.now() - sessionResponse[0].lastActivity) / 86400000 //millisecondsInOneDay
            if (sessionResponse.length > 0) {
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
*/

/*
* Get User: refactored to check for lastActivity
* Returns a user account details for a given sessionid
*/
sessionRoutes.get('/:id', async function(req, res) {

    await Session.find({sessionid: req.params.id}).then(async function(sessionResponse) {
        // this variable is no equal to days
        //const daysSinceActivity = (Date.now() - sessionResponse[0].lastActivity) / 86400000 //millisecondsInOneDay
        if (sessionResponse.length > 0) {
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
            }).catch(err => res.status(500))
        } else {
            res.status(400).send('invalid session')
        }
    }).catch(err => res.status(500))
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
                res.status(200).send(result)
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