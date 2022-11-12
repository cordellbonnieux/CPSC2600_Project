import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import '../css/match.css'
import MatchOverlay from '../components/MatchOverlay'
import Map from '../maps/Map'
const SERVER_URI = 'http://localhost:5000'


export default function Match(props) {
    const socket = useRef()
    const [ match, setMatch ] = useState(null)

    function requestMatchData() {
        socket.current.emit('match', props.user.matchId)
    }

    function consumeMatchData(data) {
        // this data is not being recieved
        if (data['_id'] == props.user.matchId) {
            setMatch(data)
        } else {
            console.log('recieved non-requested data: ' + data)
        }
    }

    useEffect(() => {
        socket.current = io(SERVER_URI)
        socket.current.on(props.user.username, data => consumeMatchData(data))
        requestMatchData()
        console.log(match)
        // i dont understand why the data returned is not cohesive to what is being outputed on the server
        // once a match is created - it has no way to be edited - yet!!
    }, [])

    useEffect(() => requestMatchData())

    return <main>
        <div id='map'>
            { match != null ? 
                <Map layers={match.map.layers} tileset={match.map.tileset} mapData={match.map.data} /> : 
                <span>Loading...</span> 
            }
        </div>
        <MatchOverlay  user={props.user} setUser={props.setUser} matchData={match} />
    </main>
}