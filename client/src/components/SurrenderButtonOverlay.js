export default function SurrenderButtonOverlay(props) {
    const { data, user, surrender } = props
 
    return <button id='surrenderBtn' className='overlay' onClick={() => surrender()}>surrender</button>
}