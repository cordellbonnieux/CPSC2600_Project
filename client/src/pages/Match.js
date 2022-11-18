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
    const [ units, setUnits ] = useState(null)
    const [ selectionIndex, setSelectionIndex ] = useState(null)

    function requestMatchData() {
        socket.current.emit('match', props.user.matchId)
    }

    function consumeMatchData(data) {
        if (data['_id'] == props.user.matchId) {
            setMatch(data)
            if (units === null) {
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
            console.log('recieved non-requested data: ' + data)
        }
    }

    function updateUnits() {
        setUnits(
            
        )
    }

    useEffect(() => {
        socket.current = io(SERVER_URI)
        socket.current.on(props.user.username, data => consumeMatchData(data))
    }, [])

    useEffect(() => requestMatchData())

    return <main>
        <div id='map'>
            { match != null && units != null ? 
                <Map 
                    user={props.user.username}
                    layers={match.map.layers} 
                    tileset={match.map.tileset} 
                    mapData={match.map.data} 
                    units={units}
                    selectionIndex={selectionIndex}
                    setSelectionIndex={setSelectionIndex}
                /> : 
                <span>Loading...</span> 
            }
        </div>
        {
            units != null ?
                <MatchOverlay  
                    user={props.user} 
                    setUser={props.setUser} 
                    matchData={match} 
                    units={props.user === match.player1.name ? match.player1.units : match.player2.units} 
                    selectionIndex={selectionIndex}
                    setSelectionIndex={setSelectionIndex}
                /> :
                <></>
        }
    </main>
}