import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import MenuButton from '../components/MenuButton'
import LogoutButton from '../components/Logout'

// server information
const SERVER_URI = 'http://localhost:5000'

export default function MainMenu(props) {
    const { logout } = props.logout
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

    return <>
    <h1>main menu</h1>
    <p>username: {username}</p>
    <p>email: {email}</p>
    <div>
        <LogoutButton />
    </div>
    </>
}