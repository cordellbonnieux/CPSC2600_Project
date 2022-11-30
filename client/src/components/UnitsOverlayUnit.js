export default function UnitsOverlayUnit(props) {
    const { selected, setSelectionIndex, setSelectionFromUI, index, data } = props
    return (
        <ul onClick={() => setSelectionFromUI(index)} className={selected ? 'selected' : ''}>
            <li>unit #{index}</li>
            <li>HP: {data.hp}</li>
            <li className={data.attacked ? '' : 'waiting'}>Attack: {data.attacked ? 'complete' : 'awaiting orders'}</li>
            <li className={data.moved ? '' : 'waiting'}>Move: {data.moved ? 'complete' : 'awaiting orders'}</li>
        </ul>
    )
}