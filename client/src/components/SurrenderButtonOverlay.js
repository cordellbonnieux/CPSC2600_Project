export default function SurrenderButtonOverlay(props) {
    const { data, user, surrender } = props
 
    return <button id='surrenderBtn' onClick={() => surrender()}>surrender</button>
}