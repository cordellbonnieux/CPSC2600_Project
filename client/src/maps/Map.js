import { useEffect, useRef } from 'react'
import ts0 from './tiles/terrain1.png'

export default function Map(props) {
    const { layers, tileset, mapData, units } = props
    const canvasRef = useRef(null)
    const spritesheet = useRef()

    function renderUnits(ctx) {
        //console.log(units)
        // TODO NEXT: paint units, add event listeners to those who have owner euqal to username

        // paint units
        for (let army = 0; army < units.length; army++) {
            for (let unit = 0; unit < units[army].units.length; unit++) {
                if (units[army].owner === props.user) {
                    // your units
                    renderUnit(ctx, unit, army, true)
                } else {
                    // enemies units
                    // renderUnit(ctx)
                }
            }
        }
    }

    /*
    * render each unit as a circle, for now
    * blue units are current player's
    * red are enemies
    */
    function renderUnit(ctx, unitNo, armyNo, userControl = false) {
        ctx.beginPath()
        ctx.fillStyle = userControl ? 'blue': 'red'
        const unit = ctx.arc(
            units[armyNo].units[unitNo].x + 16,
            units[armyNo].units[unitNo].y + 16,
            16,
            0,
            2 * Math.PI
        )
        ctx.fill()
    }

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

    function loadTiles() {
        spritesheet.current = new Image()
        if (tileset === 0) {
            spritesheet.current.src = ts0
        }
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

    return <canvas ref={canvasRef} />
}