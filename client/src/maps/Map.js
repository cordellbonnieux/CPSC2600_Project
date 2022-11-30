import { useEffect, useRef, useState } from 'react'
import ts0 from './tiles/terrain1.png'

export default function Map(props) {
    const { 
        selectionFromUI, setSelectionFromUI, layers, tileset, mapData, units, 
        user, setSelectionIndex, selectionIndex, locations, setLocations, 
        determineSelectionTiles, setUnits, updateMatch, matchData
    } = props
    const canvasRef = useRef(null)
    const spritesheet = useRef()
    const [pos, setPos ] = useState({x: null ,y: null})

    /*
    * tracking clicks to help visualize and test
    */
    //const [ clicks, setClicks ] = useState([])
    //const [ squares, setSquares ] = useState([])
    /*
    function renderClicks(ctx) {
        for (let i = 0; i < clicks.length; i++) {
            ctx.beginPath()
            ctx.fillStyle = 'pink'
            ctx.arc(clicks[i].x, clicks[i].y, 3, 0, 2 * Math.PI)
            ctx.fill()
        }
    }
    */
    /*
    function renderSquares() {
        for (let i = 0; i < squares.length; i++) {
            ctx.beginPath()
            ctx.fillStyle = 'rgba(200,200,120,0.5)'
            ctx.fillRect(squares[i].x, squares[i].y, 32,32)
            ctx.fill()
        }
    }
    */

    /*
    * renders selection tiles
    */
    function renderSelectionTiles(ctx) {
        if (selectionIndex !== null) {
            for (let tile = 0; tile < locations.length; tile++) {
                ctx.beginPath();
                if (locations[tile].occupied) {
                    if (locations[tile].enemyNumber !== null) {
                        ctx.fillStyle = 'rgba(255, 25, 255, 0.5)'
                    } else {
                        ctx.fillStyle = 'rgba(255, 25, 25, 0.5)'
                    }
                } else {
                    ctx.fillStyle = 'rgba(25, 255, 25, 0.5)'
                }
                ctx.fillRect(locations[tile].x, locations[tile].y, 32, 32);
            }
        }
    }

    /*
    * renders the units and assigns color based on control
    */
    function renderUnits(ctx) {
        if (units.length > 0) {
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

    // load tiles
    useEffect(() => {
        spritesheet.current = new Image()
        if (tileset === 0) {
            spritesheet.current.src = ts0
        }   
    }, [])

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
            // for testing only
            //renderClicks(ctx)
            //renderSquares(ctx)
            animationFrameId = window.requestAnimationFrame(render)
        }
        render()
        return () => window.cancelAnimationFrame(animationFrameId)
    })

    // add hit detection to canvas
    useEffect(() => {
        function checkUnitCoords(e) {
            setPos({
                x: e.clientX - ((document.documentElement.clientWidth - canvasRef.current.width) / 2),
                y: e.pageY - 50
            })
        }
        canvasRef.current.removeEventListener('click', checkUnitCoords)
        canvasRef.current.addEventListener('click', checkUnitCoords)
    }, [canvasRef])

    // for testing - add every click on canvas to clicks, to render
    /*
    useEffect(() => {
        setClicks(arr => [...arr, {x: pos.x, y: pos.y}])  
    }, [pos])
    */

    // detect selection from ui and use it to set pos
    useEffect(() => {
        if (selectionFromUI !== null) {
            for (let army = 0; army < units.length; army++) {
                if (units[army].owner === user) {
                    setPos({
                        // +16, so the 'click' is in the center of the unit
                        x: units[army].units[selectionFromUI].x + 16,
                        y: units[army].units[selectionFromUI].y + 16
                    })
                }
            }
            setSelectionFromUI(null)
        }
    }, [selectionFromUI, setSelectionFromUI, setPos, units, user])

    // check for unit selection
    useEffect(() => {
        let deselect = true // i can probably remove this alltogether
        const playerTurn = matchData.player1.name === user ? matchData.player1.activeTurn : matchData.player2.activeTurn
        if (playerTurn) {
        // check if the pos is valid
            for (let army = 0; army < units.length; army++) {
                if (units[army].owner === user) {
                    for (let unitNo = 0; unitNo < units[army].units.length; unitNo++) {

                        let validX = false
                        let validY = false
                            
                        // unit pos
                        const unit = {
                            x: units[army].units[unitNo].x,
                            y: units[army].units[unitNo].y
                        }

                        // check x
                        if (pos.x > unit.x) {
                            validX = pos.x - unit.x <= 32 ? true : false
                        } else {
                            validX = false
                        }
                        if (pos.y > unit.y) {
                            validY = pos.y - unit.y <= 32 ? true : false
                        } else {
                            validY = false
                        }

                        if (validY && validX) {
                            deselect = false
                            // this check prevents re-rendering on each frame
                            if (!deselect && selectionIndex != unitNo) {
                                setSelectionIndex(unitNo)
                            }
                            return
                        }
                    }
                }
            }
        }
        // deselect
        if (deselect) {
            setSelectionIndex(null)
        }   
    }, [pos, setLocations, setSelectionIndex, selectionIndex, user, units, matchData])

    // if selection index is null, then no selection tiles should appear
    useEffect(() => {
        if (selectionIndex == null) {
            setLocations([])
        }
    }, [selectionIndex, setLocations])

    // move unit or attack enemy unit
    useEffect(() => {
        if (selectionIndex !== null) {
            let matchingTile = locations.filter(loc => {
                const diffX = pos.x - loc.x
                const diffY = pos.y - loc.y
                return diffX > 0 && diffX <= 32 && diffY > 0 && diffY <= 32
            })[0]

            let thisPlayer, thatPlayer
            let newLayers = layers
            let newData = matchData

            if (matchData.player1.name === user) {
                thisPlayer = matchData.player1
                thatPlayer = matchData.player2
            } else {
                thisPlayer = matchData.player2
                thatPlayer = matchData.player1
            }

            if (matchingTile) {
                let tiles = layers[0]
                if (!matchingTile.occupied) {
                    // move
                    if (!thisPlayer.units[selectionIndex].moved) {
                        for (let i = 0; i < tiles.length; i++) {
                            //destination tile
                            if (tiles[i].posX === matchingTile.x && tiles[i].posY === matchingTile.y) {
                                tiles[i].occupied = true
                            }
                            // starting tile
                            if (tiles[i].posX === thisPlayer.units[selectionIndex].x && tiles[i].posY === thisPlayer.units[selectionIndex].y) {
                                tiles[i].occupied = false
                            }
                        }

                        // make changes
                        newLayers[0] = tiles
                        thisPlayer.units[selectionIndex].x = matchingTile.x
                        thisPlayer.units[selectionIndex].y = matchingTile.y
                        thisPlayer.units[selectionIndex].moved = true

                        // set changes
                        if (newData.player1.name === user) {
                            newData.player1 = thisPlayer
                        } else {
                            newData.player2 = thisPlayer
                        }

                        //console.log('unit ' + selectionIndex + ' moved') // remove
                    }
                } else if (!isNaN(matchingTile.enemyNumber)) {
                    // attack
                    if (!thisPlayer.units[selectionIndex].attacked) {
                        let index
                        for (let i = 0; i < thatPlayer.units.length; i++) {
                            if (thatPlayer.units[i].x === matchingTile.x && thatPlayer.units[i].y === matchingTile.y) {
                                index = i
                            }
                        }

                        if (!isNaN(index)) {
                            // make changes
                            thisPlayer.units[selectionIndex].attacked = true
                            thatPlayer.units[index].hp = thatPlayer.units[index].hp - thisPlayer.units[selectionIndex].firepower

                            if (thatPlayer.units[index].hp <= 0) {
                                // reset the occupied on tile
                                for (let i = 0; i < tiles.length; i++) {
                                    if (tiles[i].x === matchingTile.x && tiles[i].y === matchingTile.y) {
                                        // free up tile which was used by now dead unit
                                        tiles[i].occupied = false
                                    }
                                }
                                // set arbitrary negative value, to avoid errors
                                thatPlayer.units[index].x = -100
                                thatPlayer.units[index].y = -100
                            }

                            // set changes
                            newLayers[0] = tiles
                            if (newData.player1.name === user) {
                                newData.player1 = thisPlayer
                                newData.player2 = thatPlayer
                            } else {
                                newData.player2 = thisPlayer
                                newData.player1 = thatPlayer
                            }

                            console.log('unit ' + selectionIndex + ' attacked enemy ' + index) // remove
                        }
                    }
                }
                newData.layers = newLayers
                updateMatch(newData)
            }
        }
    }, [locations, pos, selectionIndex, layers, updateMatch, user, matchData])

    return <canvas ref={canvasRef} />
}