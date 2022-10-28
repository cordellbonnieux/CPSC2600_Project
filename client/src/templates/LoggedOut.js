import LoginScreen from '../pages/LoginScreen'
export default function LoggedOutTemplate(props) {
  return (
    <div id='loggedOutWrapper'>
      <LoginScreen setLoggedIn={props.setLoggedIn} />
    </div>
  )
}

