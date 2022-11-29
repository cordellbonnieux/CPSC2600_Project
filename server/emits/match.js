const Match = require('../models/matchModel')
const User = require('../models/userModel')

// TODO: many of these could solely use the socket, rather than the io

async function getMatch(io, matchId) {
    const match = await Match.findOne({'_id': matchId}).catch(err => console.log(err))
    if (match) {
        io.emit(match.player1.name, match)
        io.emit(match.player2.name, match)
    }
    //console.log('emitted ongoing match ' + match._id)
}

async function setupMatch(io, matchId) {
    const match = await Match.findOne({'_id': matchId}).catch(err => console.log(err))
    if (match) {
        io.emit(match.player1.name+'-setup', match)
        io.emit(match.player2.name+'-setup', match)
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

async function endMatch(io, matchId, victor, updateNo) {
    const m = await Match.findOneAndUpdate(
        {_id: matchId},
        {victor: victor, end: Date.now(), updateNo: updateNo},
        {new: true}
    )

    const updateUsers = await User.updateMany(
        {matchId: matchId},
        {matchId: '', inMatch: false}
    )

    //const match = await Match.findOne({_id: matchId})

    io.emit(match.player1.name, m)
    io.emit(match.player2.name, m)
}

async function updateMatch(io, matchData) {
    if (matchData !== null) {
        const match = await Match.findOneAndUpdate({_id: matchData._id}, matchData, {new: true})

        io.emit(match.player1.name, match)
        io.emit(match.player2.name, match)
        //console.log('emitted updated match ' + match._id)
    }
}

// unused
async function updateLayers(io, matchId, layers) {
    const match = await Match.findOneAndUpdate({_id: matchId}, {map: layers}, {new: true})
    io.emit(match.player1.name, match)
    io.emit(match.player2.name, match)
}

module.exports = { getMatch, endMatch, updateMatch, joinMatch, updateLayers, setupMatch }