import { useCallback, useEffect, useState } from 'react'
import MainMenu from '../pages/MainMenu'
import Match from '../pages/Match'

export default function LoggedInTemplate(props) {
  const { user, setUser, logout } = props

  /*
  * current user surrenders match
  */
  function surrender(socket, player1, player2, updateNo) {
    socket.emit('endMatch', {
        id: user.matchId,
        victor: player1 === user.username ? player2 : player1,
        updateNo: updateNo + 1
    })
    disconnectFromMatch()
  }

  const disconnectFromMatch = useCallback(() => {
    setUser(currentUser => currentUser = {...currentUser, matchId: '', inMatch: false})
  })

  const match = <Match user={user} setUser={setUser} logout={logout} surrender={surrender} disconnect={disconnectFromMatch} />
  const menu = <MainMenu user={user} setUser={setUser} logout={logout} />

  return <div id="loggedInWrapper">{user.inMatch ? match : menu}</div>
}