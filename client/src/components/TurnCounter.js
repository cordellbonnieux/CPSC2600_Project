import { useState, useEffect } from 'react'
export default function TurnCounter(props) {
    const { match, user } = props
    const [player, setPlayer] = useState(null)

    useEffect(() => {
        console.log(match.player1.name, user.username)
        setPlayer(
            match.player1.name === user.username ? match.player1 : match.player2
        )
    }, [match, user])

    return (
        player !== null ?
            (<div id='turnCounterWrapper'>
                <span>turn: {player.turn}</span>
                <span>{player.activeTurn ? 'your turn' : 'enemy\'s turn'}</span>
                <button disabled={!player.activeTurn}>complete turn</button>
            </div>) : <></>
    )
}