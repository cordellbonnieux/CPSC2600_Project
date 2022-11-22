import { useEffect, useRef } from 'react'
import ts0 from './tiles/terrain1.png'

export default function Map(props) {
    const { layers, tileset, mapData, units, user, setSelectionIndex, selectionIndex } = props
    const canvasRef = useRef(null)
    const spritesheet = useRef()

    /*
    * render selection tiles 
    */
    function renderSelectionTiles(ctx) {
        if (selectionIndex !== null) {
            for (let army = 0; army < units.length; army++) {
                if (units[army].owner === user) {
                    // find the 9 tiles around units[army].units[selectionIndex]
                    let coords = []
                    // attack + move range for now, is 3x3
                    for (let x = 0; x < 3; x++) {
                        let posX = 0
                        if (x !== 1) {
                            posX = x === 0 ? -32 : 32
                        }
                        for (let y = 0; y < 3; y++) {
                            let posY = 0
                            if (y !== 1) {
                                posY = y === 0 ? -32 : 32
                            }
                            if (!(x === 1 && y === 1)) {
                                // check here if the tile is occupied
                                function checkPos(tile) {
                                    return (
                                        units[army].units[selectionIndex].x + posX === tile.posX &&
                                        units[army].units[selectionIndex].y + posY === tile.posY
                                    )
                                }
                                let tile = layers[0].filter(checkPos)[0]
                                // check for enemy unit if occupied
                                let enemyArmy = army === 0 ? 1 : 0
                                let enemyNumber = null
                                for (let u = 0; u < units[enemyArmy].units.length; u++) {
                                    if (
                                        units[enemyArmy].units[u].x === units[army].units[selectionIndex].x + posX &&
                                        units[enemyArmy].units[u].y === units[army].units[selectionIndex].y + posY
                                    ) {
                                        enemyNumber = u
                                    }
                                }
                                coords.push({
                                    x: units[army].units[selectionIndex].x + posX,
                                    y: units[army].units[selectionIndex].y + posY,
                                    occupied: tile.occupied,
                                    enemyNumber: enemyNumber
                                })
                            }
                        }
                    }
                    // paint tiles to screen
                    for (let tile = 0; tile < coords.length; tile++) {
                        ctx.beginPath();
                        if (coords[tile].occupied) {
                            if (coords[tile].enemyNumber !== null) {
                                // TODO: add an event on the enemyNumber
                                // use updateUnits() and setUnits
                                // first spread unit changes into setUnits
                                // then call updateUnits()
                                ctx.fillStyle = 'rgba(255, 25, 255, 0.5)'
                            } else {
                                ctx.fillStyle = 'rgba(255, 25, 25, 0.5)'
                            }
                        } else {
                            ctx.fillStyle = 'rgba(25, 255, 25, 0.5)'
                        }
                        ctx.fillRect(coords[tile].x, coords[tile].y, 32, 32);
                    }
                }
            }
        }
    }

    /*
    * renders the units and assigns color based on control
    */
    function renderUnits(ctx) {
        for (let army = 0; army < units.length; army++) {
            for (let unit = 0; unit < units[army].units.length; unit++) {
                //console.log('player: ', army, ' - ', units[army].units[unit].x, units[army].units[unit].y)
                if (units[army].owner === user) {
                    units[army].units[unit].render(ctx, true)
                    if (selectionIndex === unit) {
                        units[army].units[unit].renderSelected(ctx)
                    }
                } else {
                    units[army].units[unit].render(ctx, false)
                }
            }
        }

    }

    /*
    * renders the map by tile
    */
    function renderMap(ctx) {
        for (let layer = 0; layer < layers.length; layer++) {
            let current = layers[layer]
            for (let tile = 0; tile < current.length; tile++) {
                ctx.drawImage(
                    spritesheet.current,
                    current[tile].sx,
                    current[tile].sy,
                    current[tile].width,
                    current[tile].height,
                    current[tile].posX,
                    current[tile].posY,
                    current[tile].width,
                    current[tile].height
                )
            }
        }
    }

    /*
    * loads map tile image sheet
    */
    function loadTiles() {
        spritesheet.current = new Image()
        if (tileset === 0) {
            spritesheet.current.src = ts0
        }
    }

    /*
    * Ensures canvas is correct size based on screen
    */
    function resetCanvas(ctx) {
        const currentHeight = document.documentElement.clientHeight
        const minHeight = mapData.height * mapData.tileheight
        const currentWidth = document.documentElement.clientWidth
        const maxWidth = mapData.width * mapData.tilewidth

        canvasRef.current.height = currentHeight <= minHeight ? minHeight : currentHeight
        canvasRef.current.width = currentWidth <= maxWidth ? currentWidth : maxWidth
        ctx.clearRect(0,0, canvasRef.current.width, canvasRef.current.height)
    }

    /*
    * Checks for clicks on own units
    */
    function checkUnitCoords(e) {
        const pos = {
            x: e.clientX - ((document.documentElement.clientWidth - canvasRef.current.width) / 2),
            y: e.pageY - 50
        }
        let deselect = true
        for (let army = 0; army < units.length; army++) {
            if (units[army].owner === user) {
                for (let unitNo = 0; unitNo < units[army].units.length; unitNo++) {

                    let validX = false
                    let validY = false
                    
                    // range of unit selection
                    const maxX = units[army].units[unitNo].x + 16
                    const maxY = units[army].units[unitNo].y + 16

                    // check x
                    if (pos.x > maxX) {
                        validX = pos.x - maxX <= 32 ? true : false
                    } else {
                        validX = maxX - pos.x <= 32 ? true : false
                    }

                    // check y 
                    if (pos.y > maxY) {
                        validY = pos.y - maxY <= 32 ? true : false
                    } else {
                        validY = maxY - pos.y <= 32 ? true : false
                    }

                    if (validY && validX) {
                        // also check if the unit has any attacks or movement left
                        deselect = false
                        setSelectionIndex(unitNo)
                    }
                }
            }
        }
        if (deselect) {
            setSelectionIndex(null)
        }
    }

    // load tiles
    useEffect(() => loadTiles(), [loadTiles])

    // set canvas
    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        let frames = 0
        let animationFrameId
        const render = () => {
            frames++
            resetCanvas(ctx)
            renderMap(ctx)
            renderUnits(ctx)
            renderSelectionTiles(ctx)
            animationFrameId = window.requestAnimationFrame(render)
        }
        render()
        return () => window.cancelAnimationFrame(animationFrameId)
    })

    // add hit detection to canvas
    useEffect(() => {
        canvasRef.current.removeEventListener('click', checkUnitCoords)
        canvasRef.current.addEventListener('click', checkUnitCoords)
    }, [canvasRef])

    // ensure a re-render on unit change
    useEffect(() => {}, [units, selectionIndex])

    return <canvas ref={canvasRef} />
}