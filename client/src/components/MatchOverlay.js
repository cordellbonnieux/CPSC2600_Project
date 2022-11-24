import SurrenderButton from "./SurrenderButtonOverlay";
import TurnCounter from "./TurnCounter";
import UnitsOverlay from "./UnitsOverlay";

export default function MatchOverlay(props) {
    const { user, setUser, selectionIndex, setSelectionIndex, units, matchData, surrender } = props
    return (
        <div id='overlayWrapper'>
            <TurnCounter match={matchData} user={user} />
            <UnitsOverlay units={units} selectionIndex={selectionIndex} setSelectionIndex={setSelectionIndex} />
            <SurrenderButton surrender={surrender} />
        </div>
    )
}