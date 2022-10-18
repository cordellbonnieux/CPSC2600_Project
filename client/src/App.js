import React from 'react'
import { useState, createContext } from 'react'
import { io } from 'socket.io-client'

// templates
import LoggedOutTemplate from './templates/LoggedOut'
import LoggedInTemplate from './templates/LoggedIn'

// server information
const SERVER_URI = 'http://localhost:5000'
const ServerContext = createContext()

// web sockets
const socket = io(SERVER_URI)
socket.on('connection', () => console.log('web socket connected.'))

/*
* App Component
*/
const App = () => {
  const [ loggedIn, setLoggedIn ] = useState(false)
  return (
    <ServerContext.Provider value={SERVER_URI} >
      <div id='wrapper'>
        {loggedIn ? <LoggedInTemplate /> : <LoggedOutTemplate />}
      </div>
    </ServerContext.Provider>
  )
}

export default App