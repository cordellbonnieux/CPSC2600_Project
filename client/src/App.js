import React from 'react'
import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { io } from 'socket.io-client'

// components
import Match from './pages/Match'
import MainMenu from './pages/MainMenu'
import LoginScreen from "./pages/LoginScreen"

// web sockets
const socket = io('http://localhost:5000')
socket.on('connection', () => console.log('web socket connected.'))

// logged in
const loggedInTemplate = (
  <div id="loggedInWrapper">
    <Routes>
      <Route exact path='/' element={<MainMenu />} />
      <Route exact path='/match' element={<Match />} />
    </Routes>
  </div>
)

const loggedOutTemplate = (
  <div id="loggedOutWrapper">
    <LoginScreen />
  </div>
)

//
const App = () => {
  const [ loggedIn, setLoggedIn ] = useState(false)
  return (
    <div id='wrapper'>
      {loggedIn ? loggedInTemplate : loggedOutTemplate}
    </div>
  )
}
 
export default App