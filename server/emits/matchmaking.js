const Que = require('../models/queModel')
const Match = require('../models/matchModel')
const User = require('../models/userModel')
const { nanoid } = require('nanoid')
const map3Data = require('../mapData/map3.json')

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
/*
* on connection, check for users in que
* if user is found create a new match with connecting user
* and user in the que.
*   TODO: Refactor this
*/
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
            
            // parse map data, for now there is only 1 map
            const mapData = praseTiledData(map3Data)

            // for each player copy defaultUnits and set positions
            // TODO: Refactor both these into a single function

            const player1Units = defaultUnits.map(unit => {
                let startIdx = null
                while (startIdx === null) {
                    let pos = Math.floor(Math.random() * (mapData.layers[0].length / 3))
                    if (mapData.layers[0][pos] && !mapData.layers[0][pos].occupied) {
                        startIdx = pos
                    }
                }
                unit.x = Number(mapData.layers[0][startIdx].posX) + 16 // arc starts at center
                unit.y = Number(mapData.layers[0][startIdx].posY) + 16 //
                return unit        
            })

            const player2Units = defaultUnits.map(unit => {
                let startIdx = null
                while (startIdx === null) {
                    const min = (2 * mapData.layers[0].length) / 3 
                    const max = mapData.layers[0].length
                    let pos = Math.floor(Math.random() * (max - min + 1) + min)
                    if (mapData.layers[0][pos] && !mapData.layers[0][pos].occupied) {
                        startIdx = pos
                    }
                }
                unit.x = mapData.layers[0][startIdx].posX + 16 // arc starts at center
                unit.y = mapData.layers[0][startIdx].posY + 16 // 
                return unit          
            })

            console.log(player1Units)


            // create a new match with users
            // all this inputed data should be created using a class or something
            const match = await new Match({
                start: Date.now(),
                map: mapData,
                currentPlayer: 0,
                player1: {
                    name: user1.username,
                    id: user1['_id'],
                    // temporarily set default units
                    units: player1Units,
                    color: 'red',
                    turn: 0,
                    activeTurn: false
                },
                player2: {
                    name: user2.username,
                    id: user2['_id'],
                    // temporarily set default units
                    units: player2Units,
                    color: 'blue',
                    turn: 0,
                    activeTurn: false
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

/*
* parse through the data returned from "tiled" application
*/
function praseTiledData(data, tilesetNumber = 0) {
    let layers = []
    for (let layerNo = 0; layerNo < data.layers.length; layerNo++) {
        let layer = []
        let count = 0
        for (let y = 0; y < data.height; y++) {
            for (let x = 0; x < data.width; x++) {
                const tileType = data.layers[layerNo].data[count] - 1
                // TODO: depending on the type or, other properties
                // i can later add stats to tiles
                const width = data.tilesets[tilesetNumber].tilewidth
                const height = data.tilesets[tilesetNumber].tileheight
                const occupied = data.tilesets[tilesetNumber].tiles[tileType].properties[2].value // bool - occupied or not
                const tileInSheet = getTileFromSheet(tileType, data.tilesets[tilesetNumber])
                layer.push({
                    tileType: tileType,
                    sx: tileInSheet.x,
                    sy: tileInSheet.y,
                    width: width,
                    height: height,
                    posX: x * width,
                    posY: y * height,
                    occupied: occupied
                })
                count++
            }
        }
        layers.push(layer)
    }
    return {
        layers:layers,
        tileset: tilesetNumber,
        data: {
            height: data.height,
            width: data.width,
            tilewidth: data.tilewidth,
            tileheight: data.tileheight
        }
    }
}

/*
* extract a tile's x,y coords from a sprite sheet
*/
function getTileFromSheet(tile, set) {
    let count = 0
    for (let y = 0; y < set.columns; y++) {
        for (let x = 0; x < (set.tiles.length / set.columns); x++) {
            if (count === tile) {
                return {
                    x: x * set.tilewidth,
                    y: y * set.tileheight
                }
            }
            count++
        }
    }
}

module.exports = connection