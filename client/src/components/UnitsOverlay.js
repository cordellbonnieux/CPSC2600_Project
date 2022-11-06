import Unit from './UnitsOverlayUnit'
export default function UnitsOverlay(props) {
    // overhaul this
    // why isnt this working?
    return (
        <div className='overlay' id='unitsWrapper'>
            <Unit key={0} />
            <Unit key={1} />
            <Unit key={2} />
            <Unit key={3} />
            <Unit key={4} />
        </div>
    )
}