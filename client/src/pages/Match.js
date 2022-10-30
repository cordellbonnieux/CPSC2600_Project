import { useRef, useEffect, useState } from 'react'
export default function Match(props) {
    const [ canvasSize, setCanvasSize ] = useState({
        x: document.documentElement.clientWidth,
        y: document.documentElement.clientHeight
    })
    const canvasRef = useRef(null)

    function move(unit, xchange, ychange) {

    }

    useEffect(() => {
        setCanvasSize({
            x: document.documentElement.clientWidth,
            y: document.documentElement.clientHeight
        })
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        let frameCount = 0
        let animationFrameId

        const render = () => {
            frameCount++
            // draw stuff
            animationFrameId = window.requestAnimationFrame(render)
        }
        render()

        return () => {
            window.cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <main>
            <canvas ref={canvasRef} height={canvasSize.y} width={canvasSize.x} />
        </main>
    )
}