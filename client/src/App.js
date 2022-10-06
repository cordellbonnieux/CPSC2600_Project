import React from "react";
 
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
import { io } from 'socket.io-client'
 
// We import all the components we need in our app
import Navbar from "./components/navbar";
import RecordList from "./components/recordList";
import Edit from "./components/edit";
import Create from "./components/create";

// my components
import Main from './components/main'

// this stuff should be passed into a component
/*

  OK CORDIE, WHAT YOU GOTTA DO IS MAKE THE WEBSOCKET CONNECTION WORK ON THIS END
  HERE'S THE VIDEO YOU WERE WATCHING: @12MIN

  https://www.youtube.com/watch?v=zWSvb5t_zH4

  THE BACKEND IS LOOKING PRETTY GOOD SO FAR, MAYBE YOU NEED TO USE ANOTHER 
  INSTANCE OF THE SERVER? THIS HAS YET TO BE DETERMINED!

*/
/*
import io from 'socket.io-client'
const socket = io('http://localhost:5000')

socket.on('message', text => {
  console.log(`recieved message: ${text}`)
})
*/
//

const starterContent = (
    
    <Routes>
      <Route exact path="/" element={<RecordList />} />
      <Route path="/edit/:id" element={<Edit />} />
      <Route path="/create" element={<Create />} />
    </Routes>

)

const newStuff = <Route exact path='/' element={<Main />} />

//
// web sockets
const socket = io('http://localhost:5000')
socket.on('connection')

//
 
const App = () => {
  return (
    <div>
      <Navbar />
      {starterContent}
    </div>
  )
}
 
export default App