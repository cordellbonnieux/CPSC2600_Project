import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import '../css/match.css'
import MatchOverlay from '../components/MatchOverlay'
import Map from '../maps/Map'
import Unit from '../units/Unit'
const SERVER_URI = 'http://localhost:5000'


export default function Match(props) {
    const socket = useRef()
    const [ match, setMatch ] = useState({updateNo:-1})
    const [ units, setUnits ] = useState([])
    const [ selectionFromUI, setSelectionFromUI ] = useState(null)
    const [ locations, setLocations ] = useState([])
    const [ selectionIndex, setSelectionIndex ] = useState(null)
    const { setUser, user, logout, surrender, disconnect } = props

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
    * when data is emitted from the server to the client,
    * parse and store the data in state to render the map and ui
    * TODO: this is the bottleneck, and what determines if the app works
    */
    function consumeMatchData(data, localChange = false) {
        /*
        *
        * TRY TO REFACTOR THIS COMPONENT TO A CLASS??
        * https://dev.to/bravemaster619/how-to-use-socket-io-client-correctly-in-react-app-o65
        * 
        * *
        * USE MEMO OR USE CALLBACK - ONE OF THOSE WILL SOLVE THIS!
        * 
        * */
        if (data['_id'] === user.matchId) {
            if (!isNaN(data.updateNo)) {
                // next time I'm using typescript
                if (data.updateNo > match.updateNo) {
                    console.log('update:', data.updateNo, `this must be true: ${data.updateNo} > ${match.updateNo}`)
                    setMatch(data
                        /*
                        prev => {
                        prev._id = data._id
                        prev.end = data.end
                        prev.layers = data.layers
                        prev.map = data.map
                        prev.player1 = data.player1
                        prev.player2 =  data.player2
                        prev.start = data.start
                        prev.updateNo = data.updateNo
                        prev.victor = data.victor
                        return prev
                    }*/
                    )
                    if (localChange) {
                        console.log('local data:', data)
                    }
                }
            } else {
                console.log('bad data:', data)
            }
        } else {
            console.log('really bad data:', data)
        }
    }

    /*
    * Emit new unit changes to server
    * change local state to match
    */
    function updateMatch(m) {
        // convert Units back to objects
        m.player1.units = m.player1.units.map(unit => {
            return {
                x: unit.x,
                y: unit.y,
                type: unit.type,
                moved: unit.moved,
                attacked: unit.attacked,
                firepower: unit.firepower,
                id: unit.id,
                hp: unit.hp
            }
        })
        m.player2.units = m.player2.units.map(unit => {
            return {
                x: unit.x,
                y: unit.y,
                type: unit.type,
                moved: unit.moved,
                attacked: unit.attacked,
                firepower: unit.firepower,
                id: unit.id,
                hp: unit.hp
            }
        })
        m.updateNo++
        //console.log('something\'s wrong', m)
        socket.current.emit('updateMatch' , {match: m})
        consumeMatchData(m, true)
    }

    /*
    * TODO: end turn
    */
    function endTurn() {
        let modifiedMatch = match
        if (match.player1.name === user.username) {
            modifiedMatch.player1.activeTurn = false
            modifiedMatch.player2.activeTurn = true
            modifiedMatch.player1.turn++
        } else {
            modifiedMatch.player1.activeTurn = true
            modifiedMatch.player2.activeTurn = false 
            modifiedMatch.player2.turn++
        }
        //updateMatch(units, modifiedMatch)       
   }

    /*
    * create web socket conn, after component is mounted
    */
    useEffect(() => {

    }, [])

    useEffect(() => {
        // componentDidMount
        socket.current = io(SERVER_URI)
        socket.current.on(user.username, data => consumeMatchData(data))
        return () => {
          // componentWillUnmount
          socket.current.emit('end')
        }
      }, [])

    //on each render, request data
    useEffect(() => {socket.current.emit('match', user.matchId)})

    //determine the selection tiles each time selectionIndex is changed
    useEffect(() => {determineSelectionTiles(selectionIndex)}, [selectionIndex])

    // when match data is consumed, set the units
    useEffect(() => {
        if (match.updateNo >= 0) {
            // todo: improve  this, check each value
            setUnits(prev => {
                //todo
                return [
                    {
                        owner: match.player1.name, 
                        units: match.player1.units.map((unit, i) => new Unit(
                            match.player1.name,
                            i,
                            unit.id,
                            match.player1.units[i].x,
                            match.player1.units[i].y,
                            match.player1.units[i].moved,
                            match.player1.units[i].attacked,
                            match.player1.units[i].firepower,
                            match.player1.units[i].hp
                        ))
                    },
                    {
                        owner: match.player2.name, 
                        units: match.player2.units.map((unit, i) => new Unit(
                            match.player2.name,
                            i,
                            unit.id,
                            match.player2.units[i].x,
                            match.player2.units[i].y,
                            match.player2.units[i].moved,
                            match.player2.units[i].attacked,
                            match.player2.units[i].firepower,
                            match.player2.units[i].hp
                        ))
                    }
                ]
            })
        }
    }, [match, setMatch])

    //useEffect(() => {updateMatch()}, [units, setUnits])

    /*
    * When endMatch emit is returned
    * TODO: surrender from a match and render main menu properly
    * Perhaps another state is needed to toggle when to disconnect
    */
   /*
    useEffect(() => {
        //console.log('disconnect')
        if (match !== null && match.end != null && match.end.length > 10) { // 10 is just large but not too large
            // this is causing problems
            //disconnect(socket.current)
        }
    }, [match])
    */

    /*
    * When a unit card from the ui is selected, the selectionFromUI state will contain
    * the new selectionIndex
    */
    useEffect(() => {
        if (selectionFromUI) {
            setSelectionIndex(selectionFromUI)
        }
    }, [selectionFromUI])

    return <main>
        <div id='matchOverlay'>
        {
            match.updateNo >= 0 && units.length > 0 ?
                <MatchOverlay  
                    user={user} 
                    setUser={setUser} 
                    matchData={match} 
                    units={user === match.player1.name ? match.player1.units : match.player2.units} 
                    selectionIndex={selectionIndex}
                    setSelectionIndex={setSelectionIndex}
                    surrender={surrender}
                    determineSelectionTiles={determineSelectionTiles}
                    socket={socket.current}
                    selectionFromUI={selectionFromUI}
                    setSelectionFromUI={setSelectionFromUI}
                    endTurn={endTurn}
                /> :
                <></>
        }
        </div>
        <div id='map'>
            { 
            match.updateNo >= 0 && units.length > 0 ? 
                <Map 
                    user={user.username}
                    layers={match.map.layers} 
                    tileset={match.map.tileset} 
                    mapData={match.map.data} 
                    units={units}
                    setUnits={setUnits}
                    updateMatch={updateMatch}
                    selectionIndex={selectionIndex}
                    setSelectionIndex={setSelectionIndex}
                    locations={locations}
                    setLocations={setLocations}
                    determineSelectionTiles={determineSelectionTiles}
                    selectionFromUI={selectionFromUI}
                    setSelectionFromUI={setSelectionFromUI}
                    matchData={match}
                /> : 
                <span>Loading...</span> 
            }
        </div>
    </main>
}