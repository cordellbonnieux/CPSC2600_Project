import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import '../css/match.css'
import MatchOverlay from '../components/MatchOverlay'
import Map from '../maps/Map'
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
            setUnits([
                {owner: data.player1.name, units: data.player1.units},
                {owner: data.player2.name, units: data.player2.units}
            ])
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
            { match != null ? 
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