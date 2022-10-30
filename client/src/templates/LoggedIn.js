import MainMenu from '../pages/MainMenu'
import Match from '../pages/Match'

export default function LoggedInTemplate(props) {
  return (
    <div id="loggedInWrapper">
      {
        props.user.matchid === null ? 
          <MainMenu user={props.user} logout={props.logout} /> :
          <Match user={props.user} logout={props.logout} />
      }
    </div>
  )
}