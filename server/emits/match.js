const Match = require('../models/matchModel')
const User = require('../models/userModel')

async function getMatch(socket, io, matchId) {
    const match = await Match.findOne({'_id': matchId}).catch(err => console.log(err))
    if (match) {
        io.emit(match.player1.name, match)
        io.emit(match.player2.name, match)
    }
    //console.log('emitted ongoing match ' + match._id)
}

async function joinMatch(socket, io, matchId) {
    const match = await Match.findOne({'_id': matchId}).catch(err => console.log(err))
    if (match) {
        io.emit(match.player1.name, {matchFound: true, matchId: match['_id']})
        io.emit(match.player2.name, {matchFound: true, matchId: match['_id']})
    }
    //console.log('joinning match ' + match._id)
}

async function endMatch(socket, io, matchId, victor) {
    const m = await Match.findOneAndUpdate(
        {_id: matchId},
        {victor: victor, end: Date.now()}
    ).save()

    const updateUsers = await User.updateMany(
        {matchId: matchId},
        {matchId: '', inMatch: false}
    ).save()

    const match = await Match.findOne({_id: matchId})

    io.emit(match.player1.name, match)
    io.emit(match.player2.name, match)
}

async function updateUnits(socket, io, matchId, unitData) {

    // TODO: update match

}


module.exports = { getMatch, endMatch, updateUnits, joinMatch }