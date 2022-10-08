export default function LoginForm() {
    // I LEFT OFF HERE!
    return (
        <div>
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
        </div>
    )
}