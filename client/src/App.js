//import React from 'react'
import { useEffect, useState } from 'react'

// templates
import LoggedOutTemplate from './templates/LoggedOut'
import LoggedInTemplate from './templates/LoggedIn'
import axios from 'axios'

// server information
const SERVER_URI = 'http://localhost:5000'
// TODO:add a context which holds server uri, session info etc?

/*
* App Component
*/
const App = () => {
  const [ loggedIn, setLoggedIn ] = useState(false)
  const [ user, setUser ] = useState({
    username: '',
    email: '',
    matchid: '',
    inMatch: false
    })

  function logout() {
    setUser({username: '', email: ''})
    setLoggedIn(false)
    localStorage.clear()
  }

  useEffect(() => {
    const sessionid = localStorage.getItem('sessionid') ? localStorage.getItem('sessionid') : null
    if (sessionid != null) {
      //TODO: refactor to a get request
      /*
      axios.post(SERVER_URI+'/session/getUser', {sessionid: sessionid}).then(async function(response) {
        if (response.data.status === 'valid') {
          setLoggedIn(true)
          setUser({
            username: response.data.username,
            email: response.data.email,
            matchid: response.data.matchId,
            inMatch: response.data.inMatch
          })
        } else {
          setLoggedIn(false)
          await axios.delete(SERVER_URI + '/session/' + sessionid)
          localStorage.clear()
        }
      })
      */
     axios.get(SERVER_URI + '/session/'+ sessionid).then(async function(response) {
        if (response.data.status === 'valid') {
          setLoggedIn(true)
          setUser({
            username: response.data.username,
            email: response.data.email,
            matchid: response.data.matchId,
            inMatch: response.data.inMatch
          })
        } else {
          setLoggedIn(false)
          await axios.delete(SERVER_URI + '/session/' + sessionid)
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
      {loggedIn ? <LoggedInTemplate user={user} logout={{text:'logout', action: () => logout()}}/> : <LoggedOutTemplate setLoggedIn={setLoggedIn} setUser={setUser} />}
    </div>
  )
}

export default App