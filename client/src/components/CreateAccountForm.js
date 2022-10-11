import { useState } from "react"
import { useNavigate } from 'react-router'

export default function CreateAccountForm() {
    const [ user, setUser ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ password1, setPassword1 ] = useState('')
    const [ password2, setPassword2 ] = useState('')

    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()

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
    }

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