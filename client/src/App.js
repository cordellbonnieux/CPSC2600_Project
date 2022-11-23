//import React from 'react'
import { useEffect, useState } from 'react'

// templates
import LoggedOutTemplate from './templates/LoggedOut'
import LoggedInTemplate from './templates/LoggedIn'
import axios from 'axios'

// server information
const SERVER_URI = 'http://localhost:5000'
// TODO:add a context which holds server uri, session info etc?

const App = () => {
  const [ loggedIn, setLoggedIn ] = useState(false)
  const [ loading, setLoading ] = useState(false)
  const [ user, setUser ] = useState({
    username: '',
    email: '',
    matchId: '',
    inMatch: false
  })

  /*
  * log out of account
  */
  function logout() {
    setUser({username: '', email: ''})
    setLoggedIn(false)
    setLoading(false)
    localStorage.clear()
  }

  /*
  * render ui
  */
  function ui() {
      return loggedIn ? 
      <LoggedInTemplate user={user} setUser={setUser} logout={{text:'logout', action: () => logout()}}/> : 
      <LoggedOutTemplate setLoggedIn={setLoggedIn} setUser={setUser} />
  }

  async function sessionLogin(sessionid) {
    console.log('the bird has left the nest')
    setLoading(true)
    await axios.get(SERVER_URI + '/session/'+ sessionid).then(async function(response) {
        if (response.data.status === 'valid') {
          setLoggedIn(true)
          setUser({
            username: response.data.username,
            email: response.data.email,
            matchId: response.data.matchId,
            inMatch: response.data.inMatch
          })
        } else {
          setLoggedIn(false)
          localStorage.clear()
          await axios.delete(SERVER_URI + '/session/' + sessionid)
        }
    }).then(() => setLoading(false)).then(() => console.log('bird has really returned'))
  }

  /*
  * check for session, if found, log in
  */
  useEffect(() => {
    // if a sessionid is detected in local storage, log the user in
    const sessionid = localStorage.getItem('sessionid') ? localStorage.getItem('sessionid') : null
    if (sessionid != null && !loggedIn) {
      sessionLogin(sessionid)
    } else {
      setLoggedIn(false)
      setLoading(false)
      localStorage.clear()
    }
    setLoading(false)
  }, [])

  // check for loading here
  return (
    <div id='wrapper'>
    { loading ?  <span>Loading...</span> : ui()}
    </div>
  )
}

export default App