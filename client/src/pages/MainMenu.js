import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
import MenuButton from '../components/MenuButton'

// server information
const SERVER_URI = 'http://localhost:5000'

export default function MainMenu(props) {
    const { logout } = props
    const { username, inMatch, matchId } = props.user
    const { setUser } = props.setUser
    const [ searching, setSearching ] = useState(false)
    const [ screenText, setScreenText ] = useState('')
    const [ loading, setLoading ] = useState(false)
    const socket = useRef()


    const menu = (
        <div>
            { inMatch ? 
                <button>(non-functional) return to match in progress</button> :
                <MenuButton key={1} text={searching ? 'cancel search' : 'search for match'} action={findMatch} />
            }
            <MenuButton key={2} text={'account'} action={null} />
            <MenuButton key={3} text={logout.text} action={logout.action} />
        </div>
    )

   async function findMatch() {
    if (searching) {
        await axios.delete(SERVER_URI + '/que/' + username)
            .then(() => setSearching(false)).catch(err => console.log(err))
    } else {
        await axios.post(SERVER_URI+'/que/add', {user: username})
        .then(() => {
            setSearching(true)
            socket.current.emit('matchmaking')
        }).catch(err => console.log(err))
    }
   }

    useEffect(() => {
        setLoading(true)
        // connect to web socket after component render
        socket.current = io(SERVER_URI)
        // server has found username a match, setUser to update client
        socket.current.on(username, data => {
            if (data.matchFound) {
                setUser({
                    matchId: data.matchId,
                    inMatch: true,
                })
                socket.current.close()
            }
        })
        setLoading(false)
    }, [])

    useEffect(() => {
        setLoading(true)
        axios.get(SERVER_URI + '/que/').then(async function(res) {
            res.data[0].userList.includes(username) ?
                setSearching(true) :
                setSearching(false)
        })
        setLoading(false)
    }, [])

    useEffect(() => {
        searching ? 
            setScreenText(`Searching for match, please wait...`) : 
            setScreenText(`Welcome ${username}, how would you like to proceed?`)
    }, [searching, username])

    useEffect(() => {
        if (inMatch) {
            socket.current.emit('joinmatch')
        }
    })

    // TODO: write a signal to be emitted upon clicking 'return to match'
    return (
        <main>
            <div className='screenWrapper'>
                <h1>main menu</h1>
                <p>{screenText}</p>
            </div>
            <div>
                {loading ? <span className='loading'>Loading...</span> : menu}
            </div>
        </main>
    )
}