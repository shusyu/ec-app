import React from 'react'
import {getUserId, getUsername} from '../reducks/users/selectors'
import {signOut} from '../reducks/users/operations'
import {useDispatch, useSelector} from 'react-redux'

const Home = () => {
  const dispatch = useDispatch()
  const selector = useSelector(state => state)
  const uid = getUserId(selector)
  const username = getUsername(selector)

  return(
    <div>
      <h2>Home</h2>
      <p>ユーザID: {uid}</p>
      <p>ユーザ名: {username}</p>
      <button onClick={() => dispatch(signOut())}>
        SIGN OUT
      </button>
    </div>
  )
}

export default Home
