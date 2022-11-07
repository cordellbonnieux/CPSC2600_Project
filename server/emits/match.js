const Match = require('../models/matchModel')

async function getMatch(socket, io, matchId) {
    const match = await Match.findOne({'_id': matchId})
    io.emit(match.player1.name, match)
    io.emit(match.player2.name, match)
}

module.exports = getMatch