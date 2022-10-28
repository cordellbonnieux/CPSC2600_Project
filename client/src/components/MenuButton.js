export default function MenuButton(props) {
    const { text, action, isDisabled } = props
    return (
        <div>
            <button onClick={() => action()} disabled={isDisabled}>{text}</button>
        </div>
    )
}