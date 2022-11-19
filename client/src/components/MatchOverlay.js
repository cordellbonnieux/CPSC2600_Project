import MenuLogOverlay from "./MenuLogOverlay";
import TurnCounter from "./TurnCounter";
import UnitsOverlay from "./UnitsOverlay";

export default function MatchOverlay(props) {
    const { user, setUser, selectionIndex, setSelectionIndex, units } = props
    return (
        <div id='overlayWrapper'>
            <TurnCounter />
            <UnitsOverlay units={units} selectionIndex={selectionIndex} setSelectionIndex={setSelectionIndex} />
            <MenuLogOverlay />
        </div>
    )
}