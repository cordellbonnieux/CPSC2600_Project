import { useRef, useEffect, useState } from 'react'
import MatchOverlay from '../components/MatchOverlay'
import { io } from 'socket.io-client'
import '../css/match.css'
//import mapData from '../maps/json/map3.json'
import mapTiles from '../maps/tiles/terrain1.png'
import Tile from '../maps/Tile'

const SERVER_URI = 'http://localhost:5000'

export default function Match(props) {
    const canvasRef = useRef(null)
    const socket = useRef()
    const tiles = useRef()
    const [ tileData, setTileData ] = useState(null)
    const [ matchData, setMatchData ] = useState(null)

    /*
    * render map
    */
    function drawMap(ctx, tilesetNumber = 0) {
        let count = 0
        let set = []
        if (matchData.mapData) {
            // TODO: Remove mapData all together as it will be determined by the server
            //console.log(matchData.mapData)
            const mapData = matchData.mapData

            for (let i = 0; i < mapData.layers.length; i++) {
                for (let y = 0; y < mapData.height; y++) {
                    for (let x = 0; x < mapData.width; x++) {
                        const tile = makeTile(mapData.layers[i].data[count], mapData.tilesets[tilesetNumber])
                        set.push(tile)
                        ctx.drawImage(
                            tiles.current,
                            tile.startx,
                            tile.starty,
                            mapData.tilesets[tilesetNumber].tilewidth,
                            mapData.tilesets[tilesetNumber].tileheight,
                            x * mapData.tilesets[tilesetNumber].tilewidth,
                            y * mapData.tilesets[tilesetNumber].tileheight,
                            mapData.tilesets[tilesetNumber].tilewidth,
                            mapData.tilesets[tilesetNumber].tileheight
                        )
                        count++
                    }
                }
            }
            if (tileData === null) {
                // TODO: communicate with the server as to what map is being used
                // maybe storing the mapData inside the Match record in mongo
                setTileData(set)
            }
        }
    }

    /*
    * Create a tile obj
    */
    function makeTile(tile, set) {
        tile -= 1
        let count = 0
        for (let y = 0; y < set.columns; y++) {
            for (let x = 0; x < (set.tiles.length / set.columns); x++) {
                if (count === tile) {
                    return new Tile(
                        x * set.tilewidth,
                        y * set.tileheight,
                        set.tiles[tile].properties[0].value,
                        set.tiles[tile].properties[1].value,
                        set.tiles[tile].properties[2].value,
                        set.tiles[tile].properties[3].value,
                        set.tiles[tile].properties[4].value
                    )
                }
                count++
            }
        }
    }
    
    /*
    * might have to make these funcs as part of a class
    */
   /*
    function drawUnits(ctx) {
        if (matchData) {
            for (let i = 0; i < matchData.player1.units.length; i++) {
                drawUnit(ctx, matchData.player1.name,matchData.player1.color, matchData.player1.units[i])
            }
            for (let i = 0; i < matchData.player2.units.length; i++) {
                drawUnit(ctx, matchData.player2.name, matchData.player2.color, matchData.player2.units[i])
            }
        }
    }

    function drawUnit(ctx, owner, color, unit) {
        // for now there is only a single generic unit
        ctx.beginPath()
        ctx.fillStyle = color
        ctx.arc(
            unit.x + 16, // circles drawn from center
            unit.y + 16, // circles are drawn from center
            16, //assuming a 32x32 px sprite is used
            0,
            2 * Math.PI
        )
        ctx.fill()
    }
    */
    function resetCanvas(ctx) {
        if (matchData.mapData) {
            const currentHeight = document.documentElement.clientHeight
            const minHeight = matchData.mapData.height * matchData.mapData.tileheight
            const currentWidth = document.documentElement.clientWidth
            const maxWidth = matchData.mapData.width * matchData.mapData.tilewidth
    
            canvasRef.current.height = currentHeight <= minHeight ? minHeight : currentHeight
            canvasRef.current.width = currentWidth <= maxWidth ? currentWidth : maxWidth
            ctx.clearRect(0,0, canvasRef.current.width, canvasRef.current.height)
        }
    }

    async function loadTiles() {
        // TODO: Add multiple tilesets for various layers
        tiles.current = new Image()
        tiles.current.src = await mapTiles
    }

    function getMatchData() {
        socket.current.emit('match', props.user.matchId)
    }

    useEffect(() => {
        loadTiles()
        socket.current = io(SERVER_URI)
        socket.current.on(props.user.username, data => {
            //console.log(data['_id'], props.user.matchId)
            //console.log('wtf')
            if (data['_id'] === props.user.matchId) {
                //TODO: check here for differences in x/y coords and add animations
                setMatchData(data)
                console.log(matchData)
            }
        })
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        let frameCount = 0
        let animationFrameId
        const render = () => {
            frameCount++
            getMatchData()
            //resetCanvas(ctx)
            //drawMap(ctx) // for now using a single map
            //drawUnits(ctx)
            animationFrameId = window.requestAnimationFrame(render)
        }
        render()

        return () => {
            window.cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <main>
            <MatchOverlay  user={props.user} setUser={props.setUser} matchData={matchData} />
            <canvas ref={canvasRef} />
        </main>
    )
}