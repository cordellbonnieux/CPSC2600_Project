import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import '../css/match.css'
import MatchOverlay from '../components/MatchOverlay'
import Tile from '../maps/Tile'
const SERVER_URI = 'http://localhost:5000'


export default function Match(props) {
    const socket = useRef()
    const [ match, setMatch ] = useState(null)
    const [ map, setMap ] = useState([])

    function requestMatchData() {
        socket.current.emit('match', props.user.matchId)
    }

    function consumeMatchData(data) {
        if (data['_id'] == props.user.matchId) {
            setMatch(data)
            if (map.length < 0) {
                makeMap()
            }
        } else {
            console.log('recieved non-requested data: ' + data)
        }
    }

    function makeMap(tilesetNumber = 0) {
        let count = 0
        let set = []
        for (let layer = 0; layer < match.mapData.layers.length; layer++) {
            for (let y = 0; y < match.mapData.height; y++) {
                for (let x = 0; x < match.mapData.width; x++) {
                    set.push(
                        <Tile 
                            tileset={tilesetNumber} 
                            tileNumber={match.mapData.layers[layer].data[count]} 
                        />
                    )
                    count++
                }
            }
        }
        setMap(set)
    }

    useEffect(() => {
        socket.current = io(SERVER_URI)
        socket.current.on(props.user.username, data => consumeMatchData(data))
    }, [])

    useEffect(() => requestMatchData())

    return <main>
        <div id='map'>{ map.length > 0 ? map : <span>Loading...</span>}</div>
        <MatchOverlay  user={props.user} setUser={props.setUser} matchData={match} />
    </main>
}