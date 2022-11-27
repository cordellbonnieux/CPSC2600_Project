export default function UnitsOverlayUnit(props) {
    const { selected, setSelectionIndex, setSelectionFromUI, index, data } = props
    return (
        <ul onClick={() => setSelectionFromUI(index)} className={selected ? 'selected' : ''}>
            <li>unit number: {index}</li>
            <li>health remaining: {data.hp}</li>
            <li>{data.attacked ? 'attack completed' : 'ready to attack'}</li>
            <li>{data.moved ? 'movement complete' : 'raedy to move'}</li>
        </ul>
    )
}