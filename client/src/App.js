import React from 'react'
import { useState } from 'react'
import { io } from 'socket.io-client'

// templates
import LoggedOutTemplate from './templates/LoggedOut'
import LoggedInTemplate from './templates/LoggedIn'

// web sockets
const socket = io('http://localhost:5000')
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