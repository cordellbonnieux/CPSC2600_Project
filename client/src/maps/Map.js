import { useEffect, useRef } from 'react'
import ts0 from './tiles/terrain1.png'

export default function Map(props) {
    const { layers, tileset, mapData, units, user, setSelectionIndex } = props
    const canvasRef = useRef(null)
    const spritesheet = useRef()

    /*
    * renders the units and assigns color based on control
    */
    function renderUnits(ctx) {
        for (let army = 0; army < units.length; army++) {
            if (units[army].owner === user) {
                units[army].units.forEach(unit => unit.render(ctx, true))
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
        console.log(e)
        const pos = {
            /*
            * TODO NEXT: Calculate where Y click is based on canvas offset
            */
            x: e.clientX - ((document.documentElement.clientWidth - canvasRef.current.width) / 2),
            y: e.clientY
        }
        for (let army = 0; army < units.length; army++) {
            if (units[army].owner === user) {
                for (let unitNo = 0; unitNo < units[army].units.length; unitNo++) {
                    if (isIntersect(pos, units[army].units[unitNo])) {
                        console.log('clicked on unit #' + unitNo)
                        setSelectionIndex(unitNo)
                    }
                }
            }
        }
    }

    /*
    * initial canvas set up, and main render function
    */
    useEffect(() => {
        loadTiles()
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
    }, [])

    /*
    * add event listener to canvas to detect hits
    * TODO: add the screen sie as a dependency
    */
    useEffect(() => {
        canvasRef.current.removeEventListener('click', checkUnitCoords)
        canvasRef.current.addEventListener('click', checkUnitCoords)
    }, [canvasRef])

    return <canvas ref={canvasRef} />
}