import { useRef, useEffect, useState } from 'react'
import '../css/match.css'

export default function Match(props) {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        let frameCount = 0
        let animationFrameId

        const render = () => {
            frameCount++
            // set canvas to fill screen
            canvasRef.current.height = document.documentElement.clientHeight
            canvasRef.current.width = document.documentElement.clientWidth
            //
            // draw everything here

            ctx.fillStyle = 'green'
            ctx.fillRect(0,0, canvasRef.current.width, canvasRef.current.height)
            

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
            <div className='overlay' id='turnCounterWrapper'>
                <span>turn:</span>
                <span>player's turn</span>
            </div>
            <div className='overlay' id='unitsWrapper'>
                <ul>
                    <li>unit number</li>
                    <li>health remaining:</li>
                    <li>attacks remaining:</li>
                    <li>moves remaining:</li>
                </ul>
            </div>
            <div className='overlay' id='menuWrapper'>
                <button id='surrenderBtn'>surrender</button>
                <div id='combatLogWrapper'>
                    <span>combat log</span>
                    <div id='combatLog'>...</div>
                </div>
            </div>
            <canvas ref={canvasRef} />
        </main>
    )
}