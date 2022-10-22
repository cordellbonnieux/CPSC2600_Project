import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import MenuButton from '../components/MenuButton'

// server information
const SERVER_URI = 'http://localhost:5000'

export default function MainMenu(props) {
    const { username, email } = props.user

    function findMatch() {
        // web sockets
        const socket = io(SERVER_URI)
        socket.on('connection', () => console.log('web socket connected.'))
        socket.emit('message','hey there server')
        socket.on('message',message => console.log(message))
    }

    useEffect(() => {
        findMatch()
    })

    return <>
    <h1>main menu</h1>
    <p>username: {username}</p>
    <p>email: {email}</p>
    <div>
        <MenuButton text={''} link={''} />
    </div>
    </>
}