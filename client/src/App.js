//import React from 'react'
import { useState } from 'react'
import { io } from 'socket.io-client'

// templates
import LoggedOutTemplate from './templates/LoggedOut'
import LoggedInTemplate from './templates/LoggedIn'

// server information
const SERVER_URI = 'http://localhost:5000'
// add a context which holds server uri, session info etc?

// web sockets
const socket = io(SERVER_URI)
socket.on('connection', () => console.log('web socket connected.'))

/*
* App Component
*/
const App = () => {
  const [ loggedIn, setLoggedIn ] = useState(false)
  return (
    <div id='wrapper'>
      {loggedIn ? <LoggedInTemplate /> : <LoggedOutTemplate />}
    </div>
  )
}

export default App