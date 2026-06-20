import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export function PrivateRoute({ children }) {
  const { userInfo } = useSelector(state => state.userLogin)
  
  // localStorage-ல check பண்ணு
  const userInfoFromStorage = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null

  const user = userInfo || userInfoFromStorage

  return user ? children : <Navigate to='/login' />
}

export function AdminRoute({ children }) {
  const { userInfo } = useSelector(state => state.userLogin)
  
  const userInfoFromStorage = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null

  const user = userInfo || userInfoFromStorage

  return user && user.isAdmin ? children : <Navigate to='/login' />
}