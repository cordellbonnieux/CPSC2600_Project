export default function LoginForm() {
    return (
        <div>
            <label for='userName'>
                username or email:
                <input type='text' name='userName' id='userName'></input>
            </label>
            <label for='password'>
                password:
                <input type='text' name='password' id='password'></input>
            </label>
        </div>
    )
}