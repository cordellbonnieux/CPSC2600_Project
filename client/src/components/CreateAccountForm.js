export default function CreateAccountForm() {
    return (
        <div>
            <label htmlFor='userName'>
                desired username:
                <input type='text' name='userName' id='userName'></input>
            </label>
            <label htmlFor='email'>
                email:
                <input type='email' name='email' id='email'></input>
            </label>
            <label htmlFor='password1'>
                password:
                <input type='password' name='password1' id='password1'></input>
            </label>
            <label htmlFor='password2'>
                password, again:
                <input type='password' name='password2' id='password2'></input>
            </label>
        </div>
    )
}