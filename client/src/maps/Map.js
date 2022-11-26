import { useEffect, useRef, useState } from 'react'
import ts0 from './tiles/terrain1.png'

export default function Map(props) {
    const { 
        selectionFromUI, setSelectionFromUI, layers, tileset, mapData, units, 
        user, setSelectionIndex, selectionIndex, locations, setLocations, 
        determineSelectionTiles, setUnits, updateUnits 
    } = props
    const canvasRef = useRef(null)
    const spritesheet = useRef()
    const [pos, setPos ] = useState({x: null ,y: null})

    /*
    * tracking clicks to help visualize and test
    */
    const [ clicks, setClicks ] = useState([])
    const [ squares, setSquares ] = useState([])
    function renderClicks(ctx) {
        for (let i = 0; i < clicks.length; i++) {
            ctx.beginPath()
            ctx.fillStyle = 'pink'
            ctx.arc(clicks[i].x, clicks[i].y, 3, 0, 2 * Math.PI)
            ctx.fill()
        }
        for (let i = 0; i < squares.length; i++) {
            ctx.beginPath()
            ctx.fillStyle = 'rgba(200,200,120,0.5)'
            ctx.fillRect(squares[i].x, squares[i].y, 32,32)
            ctx.fill()
        }
    }

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
            renderClicks(ctx)
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
        canvasRef.current.removeEventListener('mousedown', checkUnitCoords)
        canvasRef.current.addEventListener('mousedown', checkUnitCoords)
    }, [canvasRef])

    // for testing - add every click on canvas to clicks, to render
    useEffect(() => {
        setClicks(arr => [...arr, {x: pos.x, y: pos.y}])  
    }, [pos])

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

        // deselect
        if (deselect) {
            //console.log('deselected')
            setSelectionIndex(null)
        }   
    }, [pos, setLocations, setSelectionIndex, selectionIndex, user, units])

    // if selection index is null, then no selection tiles should appear
    useEffect(() => {
        if (selectionIndex == null) {
            setLocations([])
        }
    }, [selectionIndex, setLocations])

    // move unit or attack enemy unit
    useEffect(() => {
        if (selectionIndex !== null) {

            let matchingTiles = locations.filter(loc => {
                const diffX = pos.x - loc.x
                const diffY = pos.y - loc.y
                return diffX > 0 && diffX <= 32 && diffY > 0 && diffY <= 32
            })

            //setSquares(arr => [...arr, ...matchingTiles])

            // TODO: make a state var for which army is the users, which is set on first render
            let army = units[0].owner === user ? 0 : 1

            //console.log(matchingTiles[0])

            if (matchingTiles[0]) {
                if (!matchingTiles[0].occupied) {
                    // move
                    // check is movement is true
                    setUnits(current => {
                        current[army].units[selectionIndex].x = matchingTiles[0].x
                        current[army].units[selectionIndex].y = matchingTiles[0].y
                        return current
                    })
                } else if (matchingTiles[0].enemyNumber !== null) {
                    // attack
                }
                // emit changes
                updateUnits()
            }
        }
    }, [locations, pos, selectionIndex])

    return <canvas ref={canvasRef} />
}