import MenuLogOverlay from "./MenuLogOverlay";
import TurnCounter from "./TurnCounter";
import UnitsOverlay from "./UnitsOverlay";

export default function MatchOverlay(props) {
    const { user, setUser } = props
    return (
        <div id='overlayWrapper'>
            <TurnCounter />
            <UnitsOverlay />
            <MenuLogOverlay />
        </div>
    )
}