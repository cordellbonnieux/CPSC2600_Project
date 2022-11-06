import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
import MenuButton from '../components/MenuButton'

// server information
const SERVER_URI = 'http://localhost:5000'

export default function MainMenu(props) {
    const { logout } = props
    const { username } = props.user
    const { setUser } = props.setUser
    const [ searching, setSearching ] = useState(false)
    const [ screenText, setScreenText ] = useState('')
    const socket = useRef()

   async function findMatch() {
    if (searching) {
        await axios.delete(SERVER_URI + '/que/' + username)
            .then(() => setSearching(false))
    } else {
        await axios.post(SERVER_URI+'/que/add', {user: username})
        .then(() => setSearching(true))
    }
    // send a match making request to the server
    socket.current.emit('matchmaking')
   }

    useEffect(() => {
        // connect to web socket after component render
        socket.current = io(SERVER_URI)
        // server has found username a match, setUser to update client
        socket.current.on(username, data => {
            if (data.matchFound) {
                setUser({
                    matchId: data.matchId,
                    inMatch: true,
                })
            }
        })
    }, [])

    useEffect(() => {
        axios.get(SERVER_URI + '/que/').then(async function(res) {
            res.data[0].userList.includes(username) ?
                setSearching(true) :
                setSearching(false)
        })
    })

    useEffect(() => {
        searching ? 
            setScreenText(`Searching for match, please wait...`) : 
            setScreenText(`Welcome ${username}, how would you like to proceed?`)
        
        console.log('searching state changed to:', searching)
    }, [searching, username])

    return (
        <main>
            <div className='screenWrapper'>
                <h1>main menu</h1>
                <p>{screenText}</p>
            </div>
            <menu>
                <MenuButton key={1} text={searching ? 'cancel search' : 'search for match'} action={findMatch} />
                <MenuButton key={2} text={'account'} action={null} />
                <MenuButton key={3} text={logout.text} action={logout.action} />
            </menu>
        </main>
    )
}