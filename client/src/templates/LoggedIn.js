//import { useEffect } from 'react'
import MainMenu from '../pages/MainMenu'
import Match from '../pages/Match'

export default function LoggedInTemplate(props) {

  //useEffect(() => console.log('logged in state changed'), [props.user])

  return (
    <div id="loggedInWrapper">
      {
        props.user.inMatch ? 
          <Match user={props.user} setUser={props.setUser} logout={props.logout} /> :
          <MainMenu user={props.user} setUser={props.setUser} logout={props.logout} />
      }
    </div>
  )
}