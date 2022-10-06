import React from "react";
 
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
 
// We import all the components we need in our app
import Navbar from "./components/navbar";
import RecordList from "./components/recordList";
import Edit from "./components/edit";
import Create from "./components/create";

// this stuff should be passed into a component
import io from 'socket.io-client'
const socket = io('http://localhost:5000')

socket.on('message', text => {
  console.log(`recieved message: ${text}`)
})
//

const starterContent = (
  <div>
    <Navbar />
    <Routes>
      <Route exact path="/" element={<RecordList />} />
      <Route path="/edit/:id" element={<Edit />} />
      <Route path="/create" element={<Create />} />
    </Routes>
  </div>
)
 
const App = () => {
  return (
    <Routes>
      <Route exact path='/' element={<h1>hello world</h1>} />
    </Routes>
  )
}
 
export default App