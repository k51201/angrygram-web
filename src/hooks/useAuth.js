import { useState, useEffect } from 'react'

export default function useAuth() {
  const [authToken, setAuthToken] = useState(null)
  const [authTokenType, setAuthTokenType] = useState(null)
  const [username, setUsername] = useState('')

  // Load auth data from localStorage on mount
  useEffect(() => {
    setAuthToken(window.localStorage.getItem('authToken'))
    setAuthTokenType(window.localStorage.getItem('authTokenType'))
    setUsername(window.localStorage.getItem('username') || '')
  }, [])

  const handleSignInSuccess = (authData) => {
    setAuthToken(authData.accessToken)
    setAuthTokenType(authData.tokenType)
    setUsername(authData.username)
  }

  const handleSignUpSuccess = (authData) => {
    setAuthToken(authData.accessToken)
    setAuthTokenType(authData.tokenType)
    setUsername(authData.username)
  }

  const handleSignOut = () => {
    setAuthToken(null)
    setAuthTokenType(null)
    setUsername('')
    
    // Clear localStorage
    window.localStorage.removeItem('authToken')
    window.localStorage.removeItem('authTokenType')
    window.localStorage.removeItem('username')
  }

  return {
    authToken,
    authTokenType,
    username,
    isAuthenticated: !!authToken,
    handleSignInSuccess,
    handleSignUpSuccess,
    handleSignOut
  }
}