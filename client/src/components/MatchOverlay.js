import SurrenderButton from "./SurrenderButtonOverlay";
import TurnCounter from "./TurnCounter";
import UnitsOverlay from "./UnitsOverlay";

export default function MatchOverlay(props) {
    const { 
        socket, user, setUser, selectionIndex, setSelectionIndex, 
        units, matchData, surrender, selectionFromUI, setSelectionFromUI,
        endTurn
    } = props
    return (
        <div id='overlayWrapper'>
            <div id='topOverlayWrapper' className='overlay'>
                <TurnCounter match={matchData} user={user} endTurn={endTurn} />
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
    )
}