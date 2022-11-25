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
  const [ loading, setLoading ] = useState(true)
  const [ user, setUser ] = useState({
    username: '',
    email: '',
    matchId: '',
    inMatch: false
  })

  /*
  * log out of account
  */
  async function logout() {
    //console.log('logging out now')
    if (user.username.length > 0) {
      setUser({username: '', email: '', inMatch: false, matchId: ''})
    }
    if (localStorage.getItem('sessionid')) {
      //console.log('removing session id:', localStorage.getItem('sessionid'))
      // something is big time busted here
      await axios.delete(SERVER_URI + '/session/' + localStorage.getItem('sessionid'))
      localStorage.clear()
    }
  }

  // Login via sessionid from local storage
  async function sessionLogin(sessionid) {
    //console.log('searching for user')
    await axios.get(SERVER_URI + '/session/' + sessionid).then(response => {
      //console.log(response.data)
      if (response.data.status === 'valid') {
        //console.log('valid response')
        setUser({
          username: response.data.username,
          email: response.data.email,
          matchId: response.data.matchId,
          inMatch: response.data.inMatch
        })
      } else {
        //console.log('invalid, logging out')
        logout()
      }
    }).catch(e => console.error(e))
  }

  /*
  * check for session, if found, log in
  */
  useEffect(() => {
    const sessionid = localStorage.getItem('sessionid') ? localStorage.getItem('sessionid') : null
    if (sessionid != null) {
      sessionLogin(sessionid)
    } else {
      logout()
    }
    if (loading) {
      setLoading(false)
    }
  }, [])

  // set loggedin to true if user is found or logs in
  useEffect(() => {
    if (user.username.length > 0) {
      setLoggedIn(true)
    }
  }, [user])

  //{loading ? <span>Loading...</span> : <></>}

  return (
    <div id='wrapper'>
    {
      loggedIn ? 
        <LoggedInTemplate user={user} setUser={setUser} logout={{text:'logout', action: () => logout()}}/> : 
        <LoggedOutTemplate setLoggedIn={setLoggedIn} setUser={setUser} />
    }
    </div>
  )
}

export default App