import React from "react";
 
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
 
// We import all the components we need in our app
import Navbar from "./components/navbar";
import RecordList from "./components/recordList";
import Edit from "./components/edit";
import Create from "./components/create";

// my components
import Main from './components/main'

// this stuff should be passed into a component
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
 
const App = () => {
  return (
    <div>
      <Navbar />
      {starterContent}
    </div>
  )
}
 
export default App