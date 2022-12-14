import { useState, useEffect, useContext } from "react"
import { useNavigate } from 'react-router'
import axios from 'axios'
import { ServerContext } from "../App"

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

// TODO: add conditional rendering for when isLoading is true

export default function CreateAccountForm(props) {
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
    let [ validPassword, setPasswordValid ] = useState(false)
    let [ readyToSubmit, setReadyToSubmit ] = useState(false)
    const serverURL = useContext(ServerContext)//'http://localhost:5000/'

    async function handleSubmit(e) {
        e.preventDefault()
        if (readyToSubmit) {
            await createAccount().then(async function() {
                await createSession().then(() => {
                    props.setUser({username: user, email: email, inMatch: false, matchId: ''})
                    props.setLoggedIn(true)
                })
            })
        }
    }

    async function createAccount() {
        setLoading(true)
        return await axios
        .post(serverURL+'account/create', {
            username: user,
            email: email,
            password: password1,
            inMatch: false,
            matchId: ''
        })
        .then(username => {
            resetForm()
            setLoading(false)
            return username
        })
    }

    async function createSession() {
        return await axios
        .post(serverURL+'session/create', {
            user
        })
        .then(session => {
            localStorage.setItem('sessionid',session.data)
            return session.data
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
        } else if (user.includes(' ') || user.includes('    ')) {
            setWarningUser(error.user[2])
            setUserValid(false)
        } else {
            setLoading(true)
            axios
            .post(serverURL+'account/userexists', {user:user})
            .then(response => {
                if (response.data) {
                    setWarningUser(error.user[3])
                    setUserValid(false)
                } else {
                    setWarningUser('')
                    setUserValid(true)
                }
                setLoading(false)
            })
        }
    }

    function checkEmail() {
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            setWarningEmail(error.email[0])
            setEmailValid(false)
        } else {
            setLoading(true)
            axios
            .post(serverURL+'account/emailexists', {email:email})
            .then(response => {
                if (response.data) {
                    setWarningEmail(error.email[1])
                    setEmailValid(false)
                } else {
                    setWarningEmail('')
                    setEmailValid(true)
                }
                setLoading(false)
            })
        }
    }

    function checkPasswords() {
        if (
            !(/[A-Z]/.test(password1)) || 
            !(/\d/.test(password1)) ||
            !(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(password1))
            ) {
            setPasswordValid(false)
            setWarningPassword1(error.password[0])
            setWarningPassword2('')
        } else if (password1 !== password2) {
            setWarningPassword1('')
            setPasswordValid(false)
            if (password2.length > 0) {
                setWarningPassword2(error.password[1])
            } else {
                setWarningPassword2('')
            }
        } else {
            setPasswordValid(true)
            setWarningPassword1('')
            setWarningPassword2('')
        }

    }

    useEffect(() => {
        if (validEmail && validPassword & validUser) {
            setReadyToSubmit(true)
        } else {
            setReadyToSubmit(false)
        }
    },[validEmail, validUser, validPassword])

    // add a conditional statement which returns a loading spinner or similar
    return (
        <form onSubmit={e => handleSubmit(e)}>
            <h2>Create Account</h2>
            <label htmlFor='userName'>
                username:
                <input 
                    type='text' 
                    name='userName' 
                    id='userName'
                    onChange={e => {
                        setUser(e.target.value)
                            checkUserName()
                    }}
                    onBlur={() => checkUserName()}
                    value={user}
                ></input>
                <span className='inputFormWarning'>{warningUser}</span>
            </label>
            <label htmlFor='email'>
                email:
                <input 
                    type='email' 
                    name='email' 
                    id='email'
                    onChange={e => {
                        setEmail(e.target.value)
                            checkEmail()
                    }}
                    onBlur={() => checkEmail()}
                    value={email}
                ></input>
                <span className='inputFormWarning'>{warningEmail}</span>
            </label>
            <label htmlFor='password1'>
                password:
                <input 
                    type='password' 
                    name='password1' 
                    id='password1'
                    onChange={e => {
                        setPassword1(e.target.value)
                            checkPasswords()
                    }}
                    onBlur={() => checkPasswords()}
                    value={password1}
                ></input>
                <span className='inputFormWarning'>{warningPassword1}</span>
            </label>
            <label htmlFor='password2'>
                password:
                <input 
                    type='password' 
                    name='password2' 
                    id='password2'
                    onChange={e => {
                        setPassword2(e.target.value)
                            checkPasswords()
                    }}
                    onBlur={e => checkPasswords()}
                    value={password2}
                ></input>
                <span className='inputFormWarning'>{warningPassword2}</span>
            </label>
            <button type='submit' disabled={!readyToSubmit}>Enter credentials</button>
        </form>
    )
}