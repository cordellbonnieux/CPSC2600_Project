import { useState } from "react"
import { useNavigate } from 'react-router'
import axios from 'axios'
const serverURL = 'http://localhost:5000/createuser'

export default function CreateAccountForm() {
    const [ user, setUser ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ password1, setPassword1 ] = useState('')
    const [ password2, setPassword2 ] = useState('')
    const [ isLoading, setLoading ] = useState(false)

    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()

        // validate state

        // create account
        createAccount()
    }

    function createAccount() {
        setLoading(true)
        // axios
        axios
        .post(serverURL, {
            username: user,
            email: email,
            password: password1
        })
        .then(response => {
            // it never gets here
            resetForm()
            setLoading(false)
            console.log(response.data)
            navigate('/')
        })
        /*
        await fetch('http://localhost:5000/createuser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: user,
                email: email,
                password: password1
            })
        })
        .catch(e => {
            console.log(e.message)
            return
        })
        .then(() => {
            setUser('')
            setEmail('')
            setPassword1('')
            setPassword2('')
            navigate('/')
        })
        */
    }

    function resetForm() {
        setUser('')
        setEmail('')
        setPassword1('')
        setPassword2('')
    }

    // add a conditional statement which returns a loading spinner or similar
    return (
        <form onSubmit={e => handleSubmit(e)}>
            <h2>Create Account</h2>
            <label htmlFor='userName'>
                desired username:
                <input 
                    type='text' 
                    name='userName' 
                    id='userName'
                    onChange={e => setUser(e.target.value)}
                    value={user}
                ></input>
                <span></span>
            </label>
            <label htmlFor='email'>
                email:
                <input 
                    type='email' 
                    name='email' 
                    id='email'
                    onChange={e => setEmail(e.target.value)}
                    value={email}
                ></input>
                <span></span>
            </label>
            <label htmlFor='password1'>
                password:
                <input 
                    type='password' 
                    name='password1' 
                    id='password1'
                    onChange={e => setPassword1(e.target.value)}
                    value={password1}
                ></input>
                <span></span>
            </label>
            <label htmlFor='password2'>
                password, again:
                <input 
                    type='password' 
                    name='password2' 
                    id='password2'
                    onChange={e => setPassword2(e.target.value)}
                    value={password2}
                ></input>
                <span></span>
            </label>
            <input type='submit' value='Enter'></input>
        </form>
    )
}