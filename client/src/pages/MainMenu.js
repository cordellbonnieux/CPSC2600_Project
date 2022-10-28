import { useEffect, useState } from 'react'
import axios from 'axios'
// import { io } from 'socket.io-client'
import MenuButton from '../components/MenuButton'

// server information
const SERVER_URI = 'http://localhost:5000'


export default function MainMenu(props) {
    const { logout } = props
    const { username, email } = props.user

    const txt = [
        `Welcome ${username}, how would you like to proceed?`,
        `Searching for match, please wait...`
    ]

    const [ searching, setSearching ] = useState(false)
    const [ screenText, setScreenText ] = useState(txt[0])

    async function findMatch() {
        setSearching(true)
        setScreenText(txt[1])
        await axios.get(SERVER_URI+'/que/get')
        .then(async function(res) {
            const list = res.data[0].userList
            if (list.length > 0) {
                for (let i = 0; i < list.length; i++) {
                    if (username !== list[i]) {
                        setSearching(false)
                        return createMatch(username, list[i])
                    }
                }
            }
            return findMatch()
        })
    }

    function createMatch(user1, user2) {

    }

    useEffect(() => {
        
    }, [])

    return (
        <main>
            <div className='screenWrapper'>
                <h1>main menu</h1>
                <p>{screenText}</p>
            </div>
            <menu>
                <MenuButton key={1} text={searching ? 'cancel search' : 'search for match'} action={findMatch} isDisabled={searching} />
                <MenuButton key={2} text={'account'} action={null} />
                <MenuButton key={3} text={logout.text} action={logout.action} />
            </menu>
        </main>
    )
}

// this stuff works
        // web sockets
        //const socket = io(SERVER_URI)
        //socket.emit('message','hey there server')
        //socket.on('message',message => console.log(message))