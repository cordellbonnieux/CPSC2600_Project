import { useEffect } from 'react'
import { io } from 'socket.io-client'
import MenuButton from '../components/MenuButton'

// server information
const SERVER_URI = 'http://localhost:5000'

export default function MainMenu(props) {
    const { logout } = props
    const { username, email } = props.user

    function findMatch() {
        // web sockets
        const socket = io(SERVER_URI)
        socket.emit('message','hey there server')
        socket.on('message',message => console.log(message))
    }

    useEffect(() => {
        findMatch() // only here for the sake of testing!
    })

    return (
        <main>
            <div className='screenWrapper'>
                <h1>main menu</h1>
                <p>Welcome {username}, how would you like to proceed?</p>
            </div>
            <menu>
                <MenuButton text={'Find Match'} action={null} />
                <MenuButton text={logout.text} action={logout.action} />
            </menu>
        </main>
    )
}