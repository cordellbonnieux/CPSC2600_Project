import { useState, useEffect } from 'react'
export default function TurnCounter(props) {
    const { match, user, endTurn } = props
    const [player, setPlayer] = useState(null)

    useEffect(() => {
        setPlayer(
            match.player1.name === user.username ? match.player1 : match.player2
        )
    }, [match, user])

    return (
        player !== null ?
            (<div id='turnCounterWrapper'>
                <span>turn: {player.turn}</span>
                <span>{player.activeTurn ? 'your turn' : 'enemy\'s turn'}</span>
                <button onClick={() => endTurn()} disabled={!player.activeTurn}>complete turn</button>
            </div>) : <></>
    )
}