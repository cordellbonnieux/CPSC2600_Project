import { useEffect, useRef, useState } from 'react'
import ts0 from './tiles/terrain1.png'

export default function Map(props) {
    const { layers, tileset, mapData, units, user, setSelectionIndex, selectionIndex, locations, setLocations, determineSelectionTiles } = props
    const canvasRef = useRef(null)
    const spritesheet = useRef()

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
        //the selection
        const pos = {
            x: e.clientX - ((document.documentElement.clientWidth - canvasRef.current.width) / 2),
            y: e.pageY - 50
        }
        let deselect = true

        //console.log(selectionIndex, selectionIndex==null, selectionIndex === null)

        if (selectionIndex == null) {
            // check for unit selection
            for (let army = 0; army < units.length; army++) {
                if (units[army].owner === user) {
                    for (let unitNo = 0; unitNo < units[army].units.length; unitNo++) {

                        let validX = false
                        let validY = false
                        
                        // range of unit selection
                        const maxX = units[army].units[unitNo].x //+ 16
                        const maxY = units[army].units[unitNo].y //+ 16

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
                            deselect = false
                            setSelectionIndex(unitNo)
                            return // return if unit found
                        }
                    }
                }
            }
        } else {
            // something is already selected
            deselect = false
            let matchingTiles = locations.filter(loc => {
                const xDifference = pos.x > loc.x ? pos.x - loc.x : loc.x - pos.x
                const yDifference = pos.y > loc.y ? pos.y - loc.y : loc.y - pos.y
                // this might need to be changed to 16
                return xDifference <= 32 && yDifference <= 32
            })
            // TODO: DO SOMETHING HERE
            console.log(matchingTiles[0])
            // for now just take the first matchingTile, to improve select accuracy
            // filter the matchingTiles array

            
            
                /*
                * if a change to a unit's pos happens, it needs to be emitted
                */ 
        }

        // deselect
        if (deselect) {
            setSelectionIndex(null)
            setLocations([])
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