import { useEffect, useRef } from 'react'
import ts0 from './tiles/terrain1.png'

export default function Map(props) {
    const { layers, tileset, mapData, units, user, setSelectionIndex, selectionIndex } = props
    const canvasRef = useRef(null)
    const spritesheet = useRef()

    /*
    * renders the units and assigns color based on control
    */
    function renderUnits(ctx) {
        for (let army = 0; army < units.length; army++) {
            if (units[army].owner === user) {
                units[army].units.forEach(unit => unit.render(ctx, true))
                if (selectionIndex) {
                    units[army].units[selectionIndex].renderSelected(ctx)
                }
            } else {
                units[army].units.forEach(unit => unit.render(ctx))
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
    * Detects intersection from x,y coords (clicks) and compares it to a circle's x,y coords
    * borrowed from: 
    * https://medium.com/@lavrton/hit-region-detection-for-html5-canvas-and-how-to-listen-to-click-events-on-canvas-shapes-815034d7e9f8
    */
    function isIntersect(point, circle) {
        return Math.sqrt((point.x-circle.x) ** 2 + (point.y - circle.y) ** 2) < circle.radius;
    }

    /*
    * Checks for clicks on own units
    */
    function checkUnitCoords(e) {
        //console.log(e)
        const pos = {
            x: e.clientX - ((document.documentElement.clientWidth - canvasRef.current.width) / 2),
            y: e.pageY - 50
        }
        //console.log(e)
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

                    //console.log(minX + 16, minY + 16)


                    if (validY && validX) {
                        setSelectionIndex(unitNo)
                    }
                }
            }
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