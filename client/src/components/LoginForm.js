export default function LoginForm() {
    // I LEFT OFF HERE!
    return (
        <div>
            <label htmlFor='userName'>
                username or email:
                <input type='text' name='userName' id='userName'></input>
            </label>
            <label htmlFor='password'>
                password:
                <input type='password' name='password' id='password'></input>
            </label>
        </div>
    )
}