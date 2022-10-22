import { Route, Routes } from 'react-router-dom'
import MainMenu from '../pages/MainMenu'
import Match from '../pages/Match'

export default function LoggedInTemplate(props) {
  return (
    <div id="loggedInWrapper">
      <Routes>
        <Route exact path='/' element={<MainMenu user={props.user}/>} />
        <Route exact path='/match' element={<Match user={props.user} />} />
        <Route path='/*' element={<span>404 page</span>} />
      </Routes>
    </div>
  )
}