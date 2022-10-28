//import React from 'react'
import { useEffect, useState } from 'react'

// templates
import LoggedOutTemplate from './templates/LoggedOut'
import LoggedInTemplate from './templates/LoggedIn'
import axios from 'axios'

// server information
const SERVER_URI = 'http://localhost:5000'
// add a context which holds server uri, session info etc?

/*
* App Component
*/
const App = () => {
  const [ loggedIn, setLoggedIn ] = useState(false)
  const [ user, setUser ] = useState({
    username: '',
    email: ''
  })

  function logout() {
    setUser({username: '', email: ''})
    setLoggedIn(false)
    localStorage.clear()
  }

  useEffect(() => {
    const sessionid = localStorage.getItem('sessionid') ? localStorage.getItem('sessionid') : null
    if (sessionid != null) {
      axios
      .post(SERVER_URI+'/session/getUser', {sessionid: sessionid})
      .then(response => {
        if (response.data.status === 'valid') {
          setLoggedIn(true)
          setUser({
            username: response.data.username,
            email: response.data.email
          })
        } else {
          setLoggedIn(false)
          localStorage.clear()
        }
      })
    } else {
      setLoggedIn(false)
      localStorage.clear()
    }
  }, [])

  return (
    <div id='wrapper'>
      {loggedIn ? <LoggedInTemplate user={user} logout={{text:'logout', action: () => logout()}}/> : <LoggedOutTemplate setLoggedIn={setLoggedIn} />}
    </div>
  )
}

export default App