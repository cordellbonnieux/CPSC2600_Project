import { useState } from 'react'
import LoginForm from '../components/LoginForm'
import CreateAccountForm from '../components/CreateAccountForm'

const txt = [
    'Create an Account',
    'Login to Account'
]

export default function LoginScreen(props) {
    // login - username or email, password - google, facebook etc
    // create new account
    const [ loginForm, setLoginForm ] = useState(true)
    const [ buttonText, setButtonText ] = useState(txt[0])
    const { setLoggedIn, setUser } = props

    const handleClick = () => {
        loginForm ? setButtonText(txt[1]) : setButtonText(txt[0])
        setLoginForm(!loginForm)
    }

    return (
        <div>
            <div className='screenWrapper'>
                <h1>Battle-Sim Prototype</h1>
                <p>
                    This is a 1vs1 online turn-based strategy game. 
                    A match is over when one army is destroyed, or the weaker combatant submits.
                    Login or create an account to get into the action.
                </p>
            </div>
            <div id='loggedoutMenuWrapper'>
                <button id='loggedoutToggler' onClick={() => handleClick()}>{buttonText}</button>
                {
                    loginForm ? 
                    <LoginForm setLoggedIn={setLoggedIn} setUser={setUser} /> : 
                    <CreateAccountForm setLoggedIn={setLoggedIn} setUser={setUser} />
                }
            </div>
        </div>
    )
} 