import { useEffect, useState, useRef, useContext } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
import MenuButton from '../components/MenuButton'
import { ServerContext } from '../App'

// server information
//const SERVER_URI = 'http://localhost:5000'

export default function MainMenu(props) {
    const { logout, setUser } = props
    const { username, inMatch, matchId } = props.user
    const [ searching, setSearching ] = useState(false)
    const [ screenText, setScreenText ] = useState('')
    const socket = useRef()
    const SERVER_URI = useContext(ServerContext)


    const menu = (
        <div>
            <MenuButton key={1} text={searching ? 'cancel search' : 'search for match'} action={findMatch} />
            <MenuButton key={2} text={'logout'} action={() => logout(socket.current)} />
        </div>
    )

   async function findMatch() {
    if (searching) {
        await axios.delete(SERVER_URI + 'que/' + username)
            .then(() => setSearching(false)).catch(err => console.log(err))
    } else {
        await axios.post(SERVER_URI+ 'que/add', {user: username})
        .then(() => {
            setSearching(true)
            socket.current.emit('matchmaking')
        }).catch(err => console.log(err))
    }
   }

    useEffect(() => {
        // connect to web socket after component render
        socket.current = io(SERVER_URI)
        // server has found username a match, setUser to update client
        socket.current.on(username, data => {
            if (data.matchFound || data._id) {
                setUser({
                    username: props.user.username,
                    email: props.user.email,
                    matchId: data.matchFound ? data.matchId : data._id,
                    inMatch: true
                })
                socket.current.emit('end')
            }
        })
        return () => {
            // componentWillUnmount
            socket.current.off(username)
            socket.current.emit('end')
          }
    }, [])

    useEffect(() => {
        axios.get(SERVER_URI + 'que/').then(async function(res) {
            res.data[0].userList.includes(username) ?
                setSearching(true) :
                setSearching(false)
        })
    }, [])

    // text prompts
    useEffect(() => {
        searching ? 
            setScreenText(`Searching for match, please wait...`) : 
            setScreenText(`Welcome ${username}, how would you like to proceed?`)
    }, [searching, username])

    useEffect(() => {
        if (inMatch) {
            console.log('requesting match: ' + matchId)
            socket.current.emit('joinmatch', matchId)
        }
    }, [props.user, setUser])

    return (
        <main id='mainMenuWrapper'>
            <div>
                <div className='screenWrapper'>
                    <h1>main menu</h1>
                    <p>{screenText}</p>
                </div>
                <div id='mainMenu'>
                    {menu}
                </div>
            </div>
        </main>
    )
}