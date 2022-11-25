import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import '../css/match.css'
import MatchOverlay from '../components/MatchOverlay'
import Map from '../maps/Map'
import Unit from '../units/Unit'
const SERVER_URI = 'http://localhost:5000'


export default function Match(props) {
    const socket = useRef()
    const [ match, setMatch ] = useState(null)
    const [ units, setUnits ] = useState([])
    const [ locations, setLocations ] = useState([])
    const [ selectionIndex, setSelectionIndex ] = useState(null)
    const { setUser, user, logout } = props

    /*
    * determine location of selection tiles 
    * - when a unit is selected, 8 selection tiles will spawn around them,
    * this func determines those tiles.
    */
    function determineSelectionTiles(unitNo) {
        if (selectionIndex !== null) {
            for (let army = 0; army < units.length; army++) {
                if (units[army].owner === user.username) {
                    // find the 9 tiles around units[army].units[selectionIndex]
                    let coords = []
                    // attack + move range for now, is 3x3
                    for (let x = -1; x < 2; x++) {
                        for (let y = -1; y < 2; y++) {
                            const posX = units[army].units[unitNo].x + (x * 32)
                            const posY = units[army].units[unitNo].y + (y * 32)
                            // x,y === 0,0 is the player's selection unit position 
                            if (!(x === 0 && y === 0)) {
                                // check here if the tile is occupied
                                let tile = match.map.layers[0].filter(tile => posX === tile.posX && posY === tile.posY)[0]
                                // check for enemy unit if occupied
                                let enemyArmy = army === 0 ? 1 : 0
                                let enemyNumber = null
                                for (let u = 0; u < units[enemyArmy].units.length; u++) {
                                    if (
                                        units[enemyArmy].units[u].x === posX &&
                                        units[enemyArmy].units[u].y === posY
                                    ) {
                                        enemyNumber = u
                                    }
                                }
                                coords.push({
                                    x: posX,
                                    y: posY,
                                    occupied: tile.occupied,
                                    enemyNumber: enemyNumber
                                })
                            }
                        }
                    }
                    // set the possible click locations
                    setLocations(coords)
                }
            }
        }
    }

    /*
    * request to server to emit new match data
    */
    function requestMatchData() {
        socket.current.emit('match', user.matchId)
    }

    /*
    * current user surrenders match
    */
    async function surrender() {
        await socket.current.emit('endMatch', {
            id: props.user.matchId,
            victor: match.player1.name === user.username ?
                match.player2.name :
                match.player1.name,
        })
        /*
        setUser({
            ...user,
            matchId: '',
            inMatch: false
        })
        */
    }

    /*
    * when data is emitted from the server to the client,
    * parse and store the data in state to render the map and ui
    */
    function consumeMatchData(data) {
        if (data['_id'] == user.matchId) {

            /*
            console.log(data)
            //if match has an end
            if (data.end != null) {
                setUser({
                    username: user.username,
                    email: user.email,
                    matchId: data.matchId,
                    inMatch: false
                })
                //socket.current.close()
            }
            */

            
            // set data otherwise
            setMatch(data)
            if (units.length === 0) {
                /*
                *  TODO: add more properties to units so they may be used in ui and to 
                * check for movement or attacks
                */
                setUnits([
                    {
                        owner: data.player1.name, 
                        units: data.player1.units.map((unit, i) => new Unit(
                            data.player1.name,
                            i,
                            unit.id,
                            data.player1.units[i].x,
                            data.player1.units[i].y
                        ))
                    },
                    {
                        owner: data.player2.name, 
                        units: data.player2.units.map((unit, i) => new Unit(
                            data.player2.name,
                            i,
                            unit.id,
                            data.player2.units[i].x,
                            data.player2.units[i].y
                        ))
                    }
                ])
            } else {
                for (let playerNo = 0; playerNo < units.length; playerNo++) {
                    for (let unit = 0; unit < units[playerNo].units.length; unit++) {
                        let newX = playerNo === 0 ? data.player1.units[unit].x : data.player2.units[unit].x
                        let newY = playerNo === 0 ? data.player1.units[unit].y : data.player2.units[unit].y
                        setUnits([
                            ...units,
                            units[playerNo].units[unit].x = newX,
                            units[playerNo].units[unit].x = newY
                        ])
                    }
                }
            }

        } else {
            //console.log('recieved non-requested data: ' + data)
        }
    }

    /*
    * Emit new unit changes to server
    */
    function updateUnits() {
        socket.current.emit('updateUnits' ,user.matchId ,units)
    }

    /*
    * determine the selection tiles each time selectionIndex is changed
    */
    useEffect(() => {
        determineSelectionTiles(selectionIndex)
    }, [selectionIndex])

    /*
    * create web socket conn, after component is mounted
    */
    useEffect(() => {
        socket.current = io(SERVER_URI)
        socket.current.on(user.username, data => consumeMatchData(data))
    }, [])

    /*
    * on each render, request data
    */
    useEffect(() => requestMatchData())

    return <main>
        <div id='map'>
            { match != null && units.length > 0 ? 
                <Map 
                    user={user.username}
                    layers={match.map.layers} 
                    tileset={match.map.tileset} 
                    mapData={match.map.data} 
                    units={units}
                    setUnits={setUnits}
                    updateUnits={updateUnits}
                    selectionIndex={selectionIndex}
                    setSelectionIndex={setSelectionIndex}
                    locations={locations}
                    setLocations={setLocations}
                    determineSelectionTiles={determineSelectionTiles}
                /> : 
                <span>Loading...</span> 
            }
        </div>
        {
            units.length > 0 ?
                <MatchOverlay  
                    user={user} 
                    setUser={setUser} 
                    matchData={match} 
                    units={user === match.player1.name ? match.player1.units : match.player2.units} 
                    selectionIndex={selectionIndex}
                    setSelectionIndex={setSelectionIndex}
                    surrender={surrender}
                    determineSelectionTiles={determineSelectionTiles}
                /> :
                <></>
        }
    </main>
}