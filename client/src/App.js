//
import React from "react";
 
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
import { io } from 'socket.io-client'
 
// starter components
import Navbar from "./components/navbar";
import RecordList from "./components/recordList";
import Edit from "./components/edit";
import Create from "./components/create";

// my components
import Main from './components/Main'
//
const starterContent = (  
    <Routes>
      <Route exact path="/" element={<RecordList />} />
      <Route path="/edit/:id" element={<Edit />} />
      <Route path="/create" element={<Create />} />
    </Routes>
)
// note to self: please rename this
// Main's attributes need to be dynamic too
const newStuff = (
  <Routes>
    <Route exact path='/' element={<Main loggedIn={false} inGame={false} />} />
  </Routes>
)

// web sockets
const socket = io('http://localhost:5000')
socket.on('connection')

//
const App = () => {
  return (
    <div id='wrapper'>
      {newStuff}
    </div>
  )
}
 
export default App