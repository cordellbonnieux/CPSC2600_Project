export default function TurnCounter(props) {
    const { player } = props
    return (
        <div id='turnCounterWrapper'>
            <span>turn: {player.turn} | {player.activeTurn ? 'your turn' : 'enemy\'s turn'}</span>
        </div>
    )
}