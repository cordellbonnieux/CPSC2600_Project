import { useState } from 'react'
import LoginForm from '../components/LoginForm'
import CreateAccountForm from '../components/CreateAccountForm'

const txt = [
    'Create an Account',
    'Login to Account'
]

export default function LoginScreen(props) {
    // login - username or email, password - google, facebook etc
    // create new account
    const [ loginForm, setLoginForm ] = useState(true)
    const [ buttonText, setButtonText ] = useState(txt[0])
    const [ documentation, setDocumentation ] = useState('')
    const { setLoggedIn, setUser } = props

    const docs = (
        <div id='documentation'>
            <h2>how to play:</h2>
            <p>
                First you'll need to create an account using the create account
                form above, if you already have an account you just need to login.
            </p>
            <p>
                Once logged in you'll have the option to search for a match, 
                once another player joins the que you'll be placed into a new game.
            </p>
            <p>
                In a match each player controls 5 units, your units will appear as 
                blue circles on the map. Click on them, or their "unit card" at the bottom of
                the screen to select*.

                *clicking anywhere else on the game map will deselect your current selection
            </p>
            <p>
                Once selected, you can click on an adjacent tile, colored in green to either move to, 
                or attack any enemy on that tile. Enemies will appear as green dots on the game map.
            </p>
            <p>
                Once you've completed all your possible (or desired) moves, you can end your turn by clicking
                on the "complete turn" button in the top-left of the screen.
            </p>
            <p>
                A game is played in alternating turns, and will go on until one player submits 
                and clicks the "surrender" button in the top right of the screen.
            </p>
            <h3>Extra Marks</h3>
            <ul>
                <li>use of websockets - socket.io</li>
                <li>canvas and graphics rendering</li>
                <li>real-time data synch between users</li>
                <li>use of special hooks like useRef and useCallback</li>
                <li>several extra routes and models/schemas</li>
                <li>original algorithms to process map and tile data</li>
                <li>pretty cool design</li>
                <li>I'm sure no ones ever done a project like this for this class!</li>
            </ul>
        </div>
    )

    const handleClick = () => {
        loginForm ? setButtonText(txt[1]) : setButtonText(txt[0])
        setLoginForm(!loginForm)
    }

    const toggleDocs = () => {
        if (documentation.length === 0) {
            
        } else {

        }
        setDocumentation(documentation.length === 0 ? docs : '')
    }

    return (
        <div>
            <div className='screenWrapper'>
                <h1>Battle-Sim Prototype</h1>
                <p>
                    This 1vs1 online strategy game is <a href='https://cordellbonnieux.github.io/portfolio/' target='_blank'>my</a>  
                     final project submission for CPSC 2600 at Langara College. 
                    Search for a match to be paired with another user. 
                    Once in a match each player, controls five untis.
                    The game is over when one player surrenders.
                    
                </p>
            </div>
            <div id='loggedoutMenuWrapper'>
                <button id='loggedoutToggler' onClick={() => handleClick()}>{buttonText}</button>
                {
                    loginForm ? 
                    <LoginForm setLoggedIn={setLoggedIn} setUser={setUser} /> : 
                    <CreateAccountForm setLoggedIn={setLoggedIn} setUser={setUser} />
                }
            </div>
            <div className='screenWrapper'>
                <button id='documentationToggler' onClick={() => toggleDocs()} >Documentation</button>
                {documentation}
            </div>
        </div>
    )
} 