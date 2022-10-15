import { Route, Routes } from 'react-router-dom'
import MainMenu from '../pages/MainMenu'
import Match from '../pages/Match'

export default function LoggedInTemplate() {
  return (
    <div id="loggedInWrapper">
      <Routes>
        <Route exact path='/' element={<MainMenu />} />
        <Route exact path='/match' element={<Match />} />
        <Route path='/*' element={<span>404 page</span>} />
      </Routes>
    </div>
  )
}