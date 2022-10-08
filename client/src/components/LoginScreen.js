import { useState } from 'react'
import LoginForm from './LoginForm'
import CreateAccountForm from './CreateAccountForm'

export default function LoginScreen() {
    // login - username or email, password - google, facebook etc
    // create new account
    const [ loginForm, setLoginForm ] = useState(true)
    const [ buttonText, setButtonText ] = useState('')

    const txt = [
        'No account? Click here to create one!',
        'Already have an account? Click here to login!'
    ]

    const handleClick = () => {
        loginForm ? setButtonText(txt[1]) : setButtonText(txt[0])
        setLoginForm(!loginForm)
    }

    const handleSubmit = e => {
        e.preventDefault()
        console.log('form submitted!')
    }

    return (
        <div>
            <h1>DeathMachines Prototype</h1>
            <form onSubmit={e => handleSubmit(e)}>
                <button onClick={() => handleClick()}>{buttonText}</button>
                {loginForm ? <LoginForm /> : <CreateAccountForm />}
            </form>
        </div>
    )
} 
/*

    // handle submission
    async function onSubmit(e) {
        e.preventDefault()

        // create a new record
        const newPerson = { ...form }

        // something is not working here
        
        await fetch('http://localhost:5000/record/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPerson),
        })
        .catch(error => {
            window.alert(error)
            return
        })

        setForm({ name: '', position: '', level: ''})
        navigate('/')
    }


*/