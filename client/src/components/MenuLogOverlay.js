export default function MenuLogOverlay(props) {
    return (
        <div className='overlay' id='menuWrapper'>
            <button id='turnBtn'>finish turn</button>
            <button id='surrenderBtn'>surrender</button>
            <div id='combatLogWrapper'>
                <span>combat log</span>
                <div id='combatLog'>...</div>
            </div>
        </div>
    )
}