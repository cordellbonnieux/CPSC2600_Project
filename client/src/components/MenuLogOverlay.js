export default function MenuLogOverlay(props) {
    const { data, user, surrender } = props
 
    return (
        <div className='overlay' id='menuWrapper'>
            <button id='turnBtn'>finish turn</button>
            <button id='surrenderBtn' onClick={() => surrender()}>surrender</button>
            <div id='combatLogWrapper'>
                <span>combat log</span>
                <div id='combatLog'></div>
            </div>
        </div>
    )
}