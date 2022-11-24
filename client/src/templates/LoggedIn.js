import { useEffect, useState } from 'react'
import MainMenu from '../pages/MainMenu'
import Match from '../pages/Match'

export default function LoggedInTemplate(props) {
  const { user, setUser, logout } = props
  const match = <Match user={user} setUser={setUser} logout={logout} />
  const menu = <MainMenu user={user} setUser={setUser} logout={logout} />
  const [display, setDisplay] = useState(null)

  useEffect(() => {
    if (user.inMatch) {
      setDisplay(match)
    } else {
      setDisplay(menu)
    }
  }, [user])

  return <div id="loggedInWrapper">{display !== null ?  display : <></>}</div>
}