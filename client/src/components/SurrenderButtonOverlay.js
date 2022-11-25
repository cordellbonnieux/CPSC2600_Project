export default function SurrenderButtonOverlay(props) {
    const { data, surrender, socket } = props
    return <button id='surrenderBtn' onClick={() => surrender(socket, data.player1.name, data.player2.name)}>surrender</button>
}