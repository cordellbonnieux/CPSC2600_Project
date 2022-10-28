import { Link } from 'react-router-dom'

export default function LogoutButton() {
    
    function handleClick() {
        localStorage.clear()
    }
    
    return (
        <div>
            <Link to='/' onClick={handleClick}>Logout</Link>
        </div>
    )
}