import Match from './Match'
import MainMenu from './MainMenu'
import LoginScreen from './LoginScreen'
/**
 * Main App Component
 * Checks for user's status and outputs either 
 * the main menu, the current match or the login screen
 * @param {*} props 
 * @returns Match, MainMenu or LoginScreen
 */
export default function Main(props) {
    // this the user logged in?
    // true: in a match?
    //      true: match, false: main menu
    // false: login screen
    const { loggedIn, inGame } = props
    let output
    if (loggedIn) {
        output = inGame ? <Match /> : <MainMenu />
    } else {
        output = <LoginScreen />
    }
    return (
        <main>
            {output}
        </main>
    )
}