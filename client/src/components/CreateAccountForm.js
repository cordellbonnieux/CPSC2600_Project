import { useState, useEffect } from "react"
import { useNavigate } from 'react-router'
import axios from 'axios'

const serverURL = 'http://localhost:5000/'
const error = {
    user: [
        'username is too short',
        'username cannot contain special characters',
        'username cannot contain spaces',
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
    const [ warningUser, setWarningUser ] = useState('')
    const [ warningEmail, setWarningEmail ] = useState('')
    const [ warningPassword1, setWarningPassword1 ] = useState('')
    const [ warningPassword2, setWarningPassword2 ] = useState('')
    let [ isLoading, setLoading ] = useState(false)
    let [ validUser, setUserValid ] = useState(false)
    let [ validEmail, setEmailValid ] = useState(false)
    let [ password1Checked, setPassword1Checked ] = useState(false)
    let [ validPassword, setPasswordValid ] = useState(false)
    let [ readyToSubmit, setReadyToSubmit ] = useState(false)

    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        if (readyToSubmit) {
            createAccount()
        } else {
            alert('should not be able to submit right now')
        }
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
        if (user.length < 3) {
            setWarningUser(error.user[0])
            setUserValid(false)
        } else if (/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(user)) {
            setWarningUser(error.user[1])
            setUserValid(false)
        } else if (/^\s*$/.test(user)) {
            setWarningUser(error.user[2])
            setUserValid(false)
        } else {
            axios
            .post(serverURL+'checkifuserexists', {user:user})
            .then(response => {
                if (response.data) {
                    setWarningUser(error.user[3])
                    setUserValid(false)
                } else {
                    setWarningUser('')
                    setUserValid(true)
                }
            })
        }
    }

    function checkEmail() {
        // does this first condition work?
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            setWarningEmail(error.email[0])
            setEmailValid(false)
        } else {
            axios
            .post(serverURL+'checkifemailexists', {email:email})
            .then(response => {
                if (response.data) {
                    setWarningEmail(error.email[1])
                    setEmailValid(false)
                } else {
                    setWarningEmail('')
                    setEmailValid(true)
                }
            })
        }
    }

    function checkPasswords() {
        // if password 1 has bad format
        // display error - not ready
        // else if password 2 is not empty AND does not match
        // display error - not ready
        // else - is ready
    }

    useEffect(() => {
        console.log('current state:',validEmail,validPassword,validUser) // test
        if (validEmail && validPassword & validUser) {
            setReadyToSubmit(true)
        } else {
            setReadyToSubmit(false)
        }
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
                    onBlur={() => checkUserName()}
                    value={user}
                ></input>
                <span>{warningUser}</span>
            </label>
            <label htmlFor='email'>
                email:
                <input 
                    type='email' 
                    name='email' 
                    id='email'
                    onChange={e => setEmail(e.target.value)}
                    onBlur={() => checkEmail()}
                    value={email}
                ></input>
                <span>{warningEmail}</span>
            </label>
            <label htmlFor='password1'>
                password:
                <input 
                    type='password' 
                    name='password1' 
                    id='password1'
                    onChange={e => setPassword1(e.target.value)}
                    onBlur={() => checkPasswords()}
                    value={password1}
                ></input>
                <span>{warningPassword1}</span>
            </label>
            <label htmlFor='password2'>
                password, again:
                <input 
                    type='password' 
                    name='password2' 
                    id='password2'
                    onChange={e => setPassword2(e.target.value)}
                    onBlur={e => checkPasswords()}
                    value={password2}
                ></input>
                <span>{warningPassword2}</span>
            </label>
            <button type='submit' disabled={readyToSubmit}>Enter credentials</button>
        </form>
    )
}