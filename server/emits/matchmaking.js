const Que = require('../models/queModel')
const Match = require('../models/matchModel')
const User = require('../models/userModel')
const { nanoid } = require('nanoid')

// temporarily assign default units to each player upon match creation
const defaultUnits = [
    {
        x: 0,
        y: 0,
        type: 'temp',
        moved: false,
        attacked: false,
        firepower: 5,
        id: nanoid(),
        hp: 10
    },
    {
        x: 0,
        y: 0,
        type: 'temp',
        moved: false,
        attacked: false,
        firepower: 5,
        id: nanoid(),
        hp: 10
    },
    {
        x: 0,
        y: 0,
        type: 'temp',
        moved: false,
        attacked: false,
        firepower: 5,
        id: nanoid(),
        hp: 10
    },
    {
        x: 0,
        y: 0,
        type: 'temp',
        moved: false,
        attacked: false,
        firepower: 5,
        id: nanoid(),
        hp: 10
    },
    {
        x: 0,
        y: 0,
        type: 'temp',
        moved: false,
        attacked: false,
        firepower: 5,
        id: nanoid(),
        hp: 10
    }
]

async function connection(socket, io) {

    let user1 = {}, user2 = {}

    // check que for users
    Que.findOne().then(async function(que) {
        if (que && que.userList.length > 1) {

            // gather user data
            user1 = await User.findOne({username: que.userList[0]})
            user2 = await User.findOne({username: que.userList[1]})

            // remove users from que
            await Que.updateOne(
                {_id: que['_id']},
                {userList: que.userList.filter(u => u !== user1.username && u !== user2.username)}
            )
            
            // create a new match with users
            const match = await new Match({
                start: Date.now(),
                player1: {
                    name: user1.username,
                    id: user1['_id'],
                    // temporarily set default units
                    units: defaultUnits,
                    color: 'red',
                    turn: 0
                },
                player2: {
                    name: user2.username,
                    id: user2['_id'],
                    // temporarily set default units
                    units: defaultUnits,
                    color: 'blue',
                    turn: 0
                }
            }).save()

            // update users to contain match details
            await User.updateOne(
                {username: user1.username},
                {inMatch: true, matchId: match['_id']}
            )
            await User.updateOne(
                {username: user2.username},
                {inMatch: true, matchId: match['_id']}
            )

            // the users aren't recieving these
            io.emit(user1, {matchFound: true, matchId: match['_id']})
            io.emit(user2, {matchFound: true, matchId: match['_id']})
        }
    })
}

module.exports = connection