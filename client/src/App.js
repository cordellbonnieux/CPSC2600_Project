//import React from 'react'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

// templates
import LoggedOutTemplate from './templates/LoggedOut'
import LoggedInTemplate from './templates/LoggedIn'
import axios from 'axios'

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
  const [ user, setUser ] = useState({
    username: '',
    email: '',
    userid: ''
  })

  useEffect(() => {
    const sessionid = localStorage.getItem('sessionid') ? localStorage.getItem('sessionid') : null
    if (sessionid != null) {
      axios
      .post(SERVER_URI+'/session/getUser', {sessionid: sessionid})
      .then(response => {
        // if user is returned set current user
        // if null is returned set logged in false and clear local storage
        console.log(response)
      })
    } else {
      setLoggedIn(false)
      localStorage.clear()
    }
  }, [])

  return (
    <div id='wrapper'>
      {loggedIn ? <LoggedInTemplate /> : <LoggedOutTemplate />}
    </div>
  )
}

export default App