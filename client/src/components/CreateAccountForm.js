import { useState, useEffect } from "react"
import { useNavigate } from 'react-router'
import axios from 'axios'

const serverURL = 'http://localhost:5000/'
const error = {
    user: [
        'username is too short',
        'username taken'
    ],
    email: [
        'email format incorrect',
        'email is already in use'
    ],
    password: [
        'password must include one capital letter, a number and a special character',
        'passwords do not match'
    ]
}

export default function CreateAccountForm() {
    const [ user, setUser ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ password1, setPassword1 ] = useState('')
    const [ password2, setPassword2 ] = useState('')
    const [ isLoading, setLoading ] = useState(false)
    const [ warningUser, setWarningUser ] = useState(<></>)
    const [ warningEmail, setWarningEmail ] = useState(<></>)
    const [ warningPassword1, setWarningPassword1 ] = useState(<></>)
    const [ warningPassword2, setWarningPassword2 ] = useState(<></>)
    const [ userList, setUserList ] = useState([])

    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()

        // validate state

        // create account
        createAccount()
    }

    function createAccount() {
        setLoading(true)
        axios
        .post(serverURL+'createuser', {
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
    }

    function resetForm() {
        setUser('')
        setEmail('')
        setPassword1('')
        setPassword2('')
    }

    function checkUserName() {
        if (user.value.length < 3) {
            setWarningUser(error.user[0])
        } else {
            // if user is in the response array
            // then display error.user[1]
            // else, no error
        }
    }

    function checkEmail() {

    }

    function checkPasswords() {

    }

    useEffect(() => {
        // get the userlist
        axios
        .get(serverURL+'userlist')
        .then(res => {
            setUserList(res.data)
        })
    })

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