export default function MenuButton(props) {
    const { text, action } = props
    return (
        <div>
            <button onClick={() => action()}>{text}</button>
        </div>
    )
}