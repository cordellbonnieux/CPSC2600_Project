import { useEffect, useState } from 'react'
import Unit from './UnitsOverlayUnit'
export default function UnitsOverlay(props) {
    const { units, selectionIndex, setSelectionIndex } = props
    const [ cards, setCards ] = useState([])

    useEffect(() => {
        let unitCards = []
        for (let i = 0; i < units.length; i++) {
            unitCards.push(
            <Unit 
                data={units[i]}
                selected={selectionIndex === i} 
                setSelectionIndex={setSelectionIndex} 
                key={i} 
                index={i} 
            />)
        }
        setCards(unitCards)
    }, [units, selectionIndex])

    return (
        <div className='overlay' id='unitsWrapper'>
            { cards.length > 0 ? cards : <></> }
        </div>
    )
}