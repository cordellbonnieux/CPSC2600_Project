import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
const server = 'http://localhost:5000/'

export default function LoginForm() {
    const [ user, setUser ] = useState('')
    const [ password, setPassword ] = useState('')
    let [ isLoading, setLoading ] = useState(false)
    let [ readyToSubmit, setReadyToSubmit ] = useState(false)

    const navigate = useNavigate()

    function handleSubmit(e) {
        if (readyToSubmit) {
            e.preventDefault()
            login()
            createSession()
            navigate('/')
        }
    }

    function login() {
        setLoading(true)
        // log into account

        // check account credentials
        // return true or false
        setLoading(false)
    }

    function createSession() {
        setLoading(true)
        axios
        .post(server+'session/create', {
            user
        })
        .then(session => {
            localStorage.setItem('sessionid',session.data)
            setLoading(false)
        })
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
            <label htmlFor='userName'>
                username or email:
                <input 
                    type='text' 
                    name='userName' 
                    id='userName'
                    onChange={field => setUser(field.value)}
                ></input>
                <span></span>
            </label>
            <label htmlFor='password'>
                password:
                <input 
                    type='password' 
                    name='password' 
                    id='password'
                    onChange={field => setPassword(field.value)}
                ></input>
                <span></span>
            </label>
            <button type='submit' disabled={!readyToSubmit}>Login</button>
        </form>
    )
}