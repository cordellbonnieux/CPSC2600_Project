const Match = require('../models/matchModel')
const User = require('../models/userModel')

async function getMatch(socket, io, matchId) {
    const match = await Match.findOne({'_id': matchId})
    io.emit(match.player1.name, match)
    io.emit(match.player2.name, match)
}

async function endMatch(socket, io, matchId, victor) {
    const m = await Match.findOneAndUpdate(
        {_id: matchId},
        {victor: victor, end: Date.now()}
    )
    const updateUsers = await User.updateMany(
        {matchId: matchId},
        {matchId: '', inMatch: false}
    )
    const match = await Match.findOne({_id: matchId})

    io.emit(match.player1.name, match)
    io.emit(match.player2.name, match)
}

module.exports = { getMatch, endMatch }