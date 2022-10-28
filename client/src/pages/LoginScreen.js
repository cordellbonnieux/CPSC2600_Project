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
            <h1>DeathMachines Prototype</h1>
            <button onClick={() => handleClick()}>{buttonText}</button>
            {loginForm ? <LoginForm setLoggedIn={setLoggedIn} setUser={setUser} /> : <CreateAccountForm setLoggedIn={setLoggedIn} setUser={setUser} />}
        </div>
    )
} 