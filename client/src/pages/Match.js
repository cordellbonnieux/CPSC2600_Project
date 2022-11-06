import { useRef, useEffect, useState } from 'react'
import MatchOverlay from '../components/MatchOverlay'
import { io } from 'socket.io-client'
import '../css/match.css'
import mapData from '../maps/json/map3.json'
import mapTiles from '../maps/tiles/terrain1.png'

const SERVER_URI = 'http://localhost:5000'

export default function Match(props) {
    const canvasRef = useRef(null)
    const socket = useRef()
    const tiles = useRef()
    const [ tileData, setTileData ] = useState(null)

    /*
    * render map
    */
    function drawMap(ctx, tilesetNumber = 0) {
        let count = 0
        let set = []
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
            setTileData(set)
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
                    return {
                        startx: x * set.tilewidth,
                        starty: y * set.tileheight,
                        armor: set.tiles[tile].properties[0].value,
                        move: set.tiles[tile].properties[1].value,
                        occupied: set.tiles[tile].properties[2].value,
                        range: set.tiles[tile].properties[3].value,
                        vision: set.tiles[tile].properties[4].value
                    }
                }
                count++
            }
        }
    }

    function drawUnits() {

    }

    function resetCanvas(ctx) {
        const currentHeight = document.documentElement.clientHeight
        const minHeight = mapData.height * mapData.tileheight
        const currentWidth = document.documentElement.clientWidth
        const maxWidth = mapData.width * mapData.tilewidth

        canvasRef.current.height = currentHeight <= minHeight ? minHeight : currentHeight
        canvasRef.current.width = currentWidth <= maxWidth ? currentWidth : maxWidth
        ctx.clearRect(0,0, canvasRef.current.width, canvasRef.current.height)
    }

    async function loadTiles() {
        // below is an array, so that later on i can add other layers
        tiles.current = new Image()
        tiles.current.src = mapTiles
    }

    useEffect(() => {
        loadTiles()
        socket.current = io(SERVER_URI)
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        let frameCount = 0
        let animationFrameId

        const render = () => {
            frameCount++
            // draw everything here
            resetCanvas(ctx)
            drawMap(ctx)
            //ctx.drawImage(tiles.current,100,100)

            //
            animationFrameId = window.requestAnimationFrame(render)
        }
        render()

        return () => {
            window.cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <main>
            <MatchOverlay  user={props.user} setUser={props.setUser}  />
            <canvas ref={canvasRef} />
        </main>
    )
}