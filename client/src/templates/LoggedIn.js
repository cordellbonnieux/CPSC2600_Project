import { useEffect, useState } from 'react'
import MainMenu from '../pages/MainMenu'
import Match from '../pages/Match'

export default function LoggedInTemplate(props) {
  const { user, setUser, logout } = props
  const match = <Match user={user} setUser={setUser} logout={logout} />
  const menu = <MainMenu user={user} setUser={setUser} logout={logout} />

  return <div id="loggedInWrapper">{user.inMatch ? match : menu}</div>
}