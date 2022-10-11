import { useState } from 'react'
import LoginForm from './LoginForm'
import CreateAccountForm from './CreateAccountForm'

const txt = [
    'Create an Account',
    'Login to Account'
]

export default function LoginScreen() {
    // login - username or email, password - google, facebook etc
    // create new account
    const [ loginForm, setLoginForm ] = useState(true)
    const [ buttonText, setButtonText ] = useState(txt[0])

    const handleClick = () => {
        loginForm ? setButtonText(txt[1]) : setButtonText(txt[0])
        setLoginForm(!loginForm)
    }

    return (
        <div>
            <h1>DeathMachines Prototype</h1>
            <button onClick={() => handleClick()}>{buttonText}</button>
            {loginForm ? <LoginForm /> : <CreateAccountForm />}
        </div>
    )
} 