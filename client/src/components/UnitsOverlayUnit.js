export default function UnitsOverlayUnit(props) {
    const { selected, setSelectionIndex, setSelectionFromUI, index, data } = props
    return (
        <ul onClick={() => setSelectionFromUI(index)} className={selected ? 'selected' : ''}>
            <li>unit number: {index}</li>
            <li>health remaining: {data.hp}</li>
            <li>ready to attack: {data.attacked}</li>
            <li>ready to move: {data.moved}</li>
        </ul>
    )
}