import MainMenu from '../pages/MainMenu'
import Match from '../pages/Match'

export default function LoggedInTemplate(props) {
  return (
    <div id="loggedInWrapper">
      {
        props.user.inMatch ? 
          <Match user={props.user} logout={props.logout} /> :
          <MainMenu user={props.user} logout={props.logout} />
      }
    </div>
  )
}