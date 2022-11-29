import SurrenderButton from "./SurrenderButtonOverlay";
import TurnCounter from "./TurnCounter";
import UnitsOverlay from "./UnitsOverlay";
import { useState, useEffect } from 'react'

export default function MatchOverlay(props) {
    const { 
        socket, user, selectionIndex, setSelectionIndex, 
        units, matchData, surrender, selectionFromUI, setSelectionFromUI,
        endTurn
    } = props

    const [player, setPlayer] = useState(null)

    useEffect(() => {
        setPlayer(
            matchData.player1.name === user.username ? matchData.player1 : matchData.player2
        )
    }, [matchData, user])

    return (
        player !== null ? (
            <div id='overlayWrapper'>
                <div id='topOverlayWrapper' className='overlay'>
                    <button onClick={() => endTurn()} disabled={!player.activeTurn}>complete turn</button>
                    <TurnCounter player={player} match={matchData} user={user} endTurn={endTurn} />
                    <SurrenderButton surrender={surrender} socket={socket} data={matchData} />
                </div>
                <UnitsOverlay 
                    units={units} 
                    selectionIndex={selectionIndex} 
                    setSelectionIndex={setSelectionIndex} 
                    selectionFromUI={selectionFromUI}
                    setSelectionFromUI={setSelectionFromUI}
                    />
            </div>
        ) : <></>
    )
}