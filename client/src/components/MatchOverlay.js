import SurrenderButton from "./SurrenderButtonOverlay";
import TurnCounter from "./TurnCounter";
import UnitsOverlay from "./UnitsOverlay";

export default function MatchOverlay(props) {
    const { user, setUser, selectionIndex, setSelectionIndex, units, matchData, surrender } = props
    return (
        <div id='overlayWrapper'>
            <div id='topOverlayWrapper' className='overlay'>
                <TurnCounter match={matchData} user={user} />
                <SurrenderButton surrender={surrender} />
            </div>
            <UnitsOverlay units={units} selectionIndex={selectionIndex} setSelectionIndex={setSelectionIndex} />
        </div>
    )
}