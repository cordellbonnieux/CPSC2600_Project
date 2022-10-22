import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
const server = 'http://localhost:5000/'

const submissionErrorWarnings = [
    'invalid password',
    'username does not exist',
    'server error, please try again'
]

export default function LoginForm() {
    const [ user, setUser ] = useState('')
    const [ password, setPassword ] = useState('')
    let [ userFound, setUserFound ] = useState(false)
    let [ isLoading, setLoading ] = useState(false)
    let [ readyToSubmit, setReadyToSubmit ] = useState(false)
    const [ warnings, setWarnings ] = useState({
        password: '',
        username: '',
        server: ''
    })

    const navigate = useNavigate()

    function handleSubmit(e) {
        if (readyToSubmit) {
            e.preventDefault()
            login()
            if (userFound) {
                createSession()
                resetForm()
                navigate('/')
            } else {
                // do something else here?
                console.log('credentials incorrect!')
            }
        }
    }

    function resetForm() {
        setUser('')
        setPassword('')
        setUserFound(false)
        setReadyToSubmit(false)
    }

    function login() {
        setLoading(true)
        // log into account
        axios
        .post(server+'account/login', {
            username: user,
            password: password
        })
        .then(response => {
            // login or don't
            console.log(response.data.result)
            //
            const { result } = response.data
            if (result === 'valid') {
                setUserFound(true)
            } else {
                setUserFound(false)
                if (result === 'invalid password') {
                    setWarnings({password: submissionErrorWarnings[0]})
                } else if (result === 'invalid user') {
                    setWarnings({username: submissionErrorWarnings[1]})
                } else {
                    setWarnings({server: submissionErrorWarnings[2]})
                }
            }
            setLoading(false)
        })
    }

    function createSession() {
        setLoading(true)
        axios
        .post(server+'session/create', {
            user
        })
        .then(session => {
            // only create session if user exists
            // route only returns key if user is found
            if (session.data.length > 0) {
                localStorage.setItem('sessionid', session.data)
            }            
            setLoading(false)
        })
    }

    function checkForSubmit() {
        if (user.length > 2 && password.length > 5) {
            setReadyToSubmit(true)
        } else {
            setReadyToSubmit(false)
        }
    }

    useEffect(() => {
        checkForSubmit()
    })

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
                        checkForSubmit()
                        setWarnings({username: '', server: ''})
                    }}
                    onBlur={field => {
                        setUser(field.target.value)
                        checkForSubmit()
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
                        checkForSubmit()
                        setWarnings({password: '', server: ''})
                    }}
                    onBlur={field => {
                        setPassword(field.target.value)
                        checkForSubmit()
                    }}
                ></input>
                <span>{warnings.password}</span>
            </label>
            <button type='submit' disabled={!readyToSubmit}>Login</button>
        </form>
    )
}