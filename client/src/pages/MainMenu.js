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
        `Searching for match, please wait...`,
        'Opponent found, prepare for battle.'
    ]

    const [ searching, setSearching ] = useState(false)
    const [ screenText, setScreenText ] = useState(txt[0])

    /*
    async function findMatch() {
        if (!searching) {
            setSearching(true)
            await addToQue()
            while(searching) {
                console.log('...searching')
                await axios.get(SERVER_URI + '/que/')
                .then(async function(res) {
                    const list = res.data[0].userList
                    if (list.length > 0) {
                        for (let i = 0; i < list.length; i++) {
                            if (username !== list[i]) {
                                setSearching(false)
                                setScreenText(txt[2])
                                return createMatch(username, list[i])
                            }
                        }
                    }
                })
            }
        } else {
            setSearching(true)
            //removeFromQue(username)
        }
    }
    */
   async function findMatch() {
    if (searching) {
        removeFromQue(username)
        // close socket conn
    } else {
        addToQue()
        // set socket object state
        // open socket
    }
   }

    async function addToQue() {
        await axios.post(SERVER_URI+'/que/add', {user: username})
    }

    async function removeFromQue(u) {
        //await axios.post(SERVER_URI+'/que/remove', {user: u})
        await axios.delete(SERVER_URI + '/que/' + u)
    }

    async function createMatch(user1, user2) {
        await removeFromQue(user1)
        await removeFromQue(user2)
        await axios.post(SERVER_URI+'/match/create', {
            user1,
            user2
        })
    }

    useEffect(() => {
        async function userInQue() {
            await axios.get(SERVER_URI + '/que/').then(async function(res) {
                if(res.data[0].userList.includes(username)) {
                    return true
                } else {
                    return false
                }
            })
        }
        userInQue() ? setSearching(true) : setSearching(false)
        searching ? 
            setScreenText(`Searching for match, please wait...`) : 
            setScreenText(`Welcome ${username}, how would you like to proceed?`)
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

// this stuff works
        // web sockets
        //const socket = io(SERVER_URI)
        //socket.emit('message','hey there server')
        //socket.on('message',message => console.log(message))