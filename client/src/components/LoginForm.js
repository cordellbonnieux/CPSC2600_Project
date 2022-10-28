import axios from 'axios'
import { useState, useEffect } from 'react'
const server = 'http://localhost:5000/'

const submissionErrorWarnings = [
    'invalid password',
    'username does not exist',
    'server error, please try again'
]

export default function LoginForm(props) {
    const [ user, setUser ] = useState('')
    const [ password, setPassword ] = useState('')
    let [ isLoading, setLoading ] = useState(false)
    let [ readyToSubmit, setReadyToSubmit ] = useState(false)
    const [ warnings, setWarnings ] = useState({
        password: '',
        username: '',
        server: ''
    })

    async function handleSubmit(e) {
        if (readyToSubmit) {
            e.preventDefault()
            await login().then(async function(loginResponse){
                if(loginResponse === 'valid') {
                    await createSession()
                    .then(async function() {
                        setLoading(true)
                        return await axios.post(server+'account/getemail', {username: user})
                        .then(email => {
                            setLoading(false)
                            props.setUser({username: user, email: email.data})
                            props.setLoggedIn(true)
                            resetForm()
                        })
                    })
                } else {
                    setWarnings({server: loginResponse})
                }
            })
        }
    }

    async function login() {
        setLoading(true)
        try {
            return await axios
            .post(server+'account/login', {
                username: user,
                password: password
            })
            .then(response => {
                setLoading(false)
                const { result } = response.data
                if (result === 'valid') {
                    // pass the user data UP the tree and set logged in
                } else {
                    if (result === 'invalid password') {
                        setWarnings({password: submissionErrorWarnings[0]})
                    } else if (result === 'invalid user') {
                        setWarnings({username: submissionErrorWarnings[1]})
                    } else {
                        setWarnings({server: submissionErrorWarnings[2]})
                    }
                }
                setLoading(false)
                return result
            })
        } catch(e) {
            console.log(e.message)
            setLoading(false)
            return 'server error'
        }
    }

    async function createSession() {
        setLoading(true)
        return await axios
        .post(server+'session/create', {
            user
        })
        .then(session => {
            let resultText = 'invalid'
            if (session.data.length > 0) {
                localStorage.setItem('sessionid', session.data)
                resultText = 'valid'
            }            
            setLoading(false)
            return resultText
        })
    }

    function resetForm() {
        setUser('')
        setPassword('')
        setReadyToSubmit(false)
    }

    useEffect(() => {
        if (user.length > 2 && password.length > 5) {
            setReadyToSubmit(true)
        } else {
            setReadyToSubmit(false)
        }
    }, [user, password])

    // add a loading spinner

    return (
        <form onSubmit={e => handleSubmit(e)}>
            <h2>Login</h2>
            <span>{warnings.server}</span>
            <label htmlFor='userName'>
                username:
                <input 
                    type='text' 
                    name='userName' 
                    id='userName'
                    onChange={field => {
                        setUser(field.target.value)
                        setWarnings({username: '', server: ''})
                    }}
                    onBlur={field => {
                        setUser(field.target.value)
                    }}
                ></input>
                <span>{warnings.username}</span>
            </label>
            <label htmlFor='password'>
                password:
                <input 
                    type='password' 
                    name='password' 
                    id='password'
                    onChange={field => {
                        setPassword(field.target.value)
                        setWarnings({password: '', server: ''})
                    }}
                    onBlur={field => {
                        setPassword(field.target.value)
                    }}
                ></input>
                <span>{warnings.password}</span>
            </label>
            <button type='submit' disabled={!readyToSubmit}>Login</button>
        </form>
    )
}