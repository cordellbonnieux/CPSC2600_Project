import axios from 'axios'
const server = 'http://localhost:5000/'

export default function LoginForm() {

    function handleSubmit(e) {
        e.preventDefault()
        createSession('cordell')
    }

    function createSession(user) {
        axios
        .post(server+'session/create',{user:user})
        .then(res => {
            console.log(res)
        })
    }
    // I LEFT OFF HERE!
    return (
        <form>
            <h2>Login</h2>
            <label htmlFor='userName'>
                username or email:
                <input type='text' name='userName' id='userName'></input>
                <span></span>
            </label>
            <label htmlFor='password'>
                password:
                <input type='password' name='password' id='password'></input>
                <span></span>
            </label>
            <input type='submit' value='Enter' onClick={e => handleSubmit(e)}></input>
        </form>
    )
}