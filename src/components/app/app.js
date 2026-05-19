import { useEffect, useState } from 'react'
import { Button, Input, Modal } from '@mui/material'
import { styled } from '@mui/material/styles'

import AngrygramApiService from '../../services'
import ImageUpload from '../image-upload'
import Post from '../post'

import './app.css'

const BASE_URL = 'http://localhost:8000/'

function getModalStyle() {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  }
}

const ModalPaper = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  position: 'absolute',
  width: 400,
  border: '2px solid #000',
  boxShadow: theme.shadows[5],
  padding: theme.spacing(2, 4, 3),
}))

const App = () => {
  const apiService = new AngrygramApiService()
  const serviceCtx = {
    apiService: apiService,
  }

  const [posts, setPosts] = useState([])
  const [openSignIn, setOpenSignIn] = useState(false)
  const [openSignUp, setOpenSignUp] = useState(false)
  const [modalStyle] = useState(getModalStyle)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [authToken, setAuthToken] = useState(null)
  const [authTokenType, setAuthTokenType] = useState(null)

  useEffect(() => {
    setAuthToken(window.localStorage.getItem('authToken'))
    setAuthTokenType(window.localStorage.getItem('authTokenType'))
    setUsername(window.localStorage.getItem('username'))
  }, [])

  useEffect(() => {
    fetch(BASE_URL + 'api/v1/post')
      .then(res => {
        const response = res.json()
        if (res.ok)
          return response
        else
          throw new Error('Something went wrong')
      })
      .then(data => data.sort((a, b) => b.timestamp.localeCompare(a.timestamp)))
      .then(data => setPosts(data))
      .catch(err => console.log(err))
  }, [])

  const onSignIn = (event) => {
    event.preventDefault()

    const formData = new FormData()
    formData.append('grant_type', 'password')
    formData.append('password', password)
    formData.append('username', username)

    const requestOptions = {
      method: 'POST',
      body: formData
    }

    fetch(BASE_URL + 'api/v1/auth/login', requestOptions)
      .then(res => {
        if (res.ok) return res.json()
        else throw new Error('Login failed')
      })
      .then(data => {
        setOpenSignIn(false)
        setAuthToken(data.accessToken)
        setAuthTokenType(data.tokenType)
        setPassword('')
        data.accessToken
          ? window.localStorage.setItem('authToken', data.accessToken)
          : window.localStorage.removeItem('authToken')
        data.tokenType
          ? window.localStorage.setItem('authTokenType', data.tokenType)
          : window.localStorage.removeItem('authTokenType')
        data.username
          ? window.localStorage.setItem('username', data.username)
          : window.localStorage.removeItem('username')
      })
      .catch(err => console.log(err))
  }

  const onSignOut = (event) => {
    event.preventDefault()
    setAuthToken(null)
    window.localStorage.removeItem('authToken')
    setAuthTokenType(null)
    window.localStorage.removeItem('authTokenType')
    setUsername('')
    window.localStorage.removeItem('username')
  }

  const onSignUp = (event) => {
    event.preventDefault()

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    }

    fetch(BASE_URL + 'api/v1/user', requestOptions)
      .then(res => {
        if (res.ok) return res.json()
        else throw new Error('Sign up failed')
      })
      .then(data => {
        setOpenSignUp(false)
        onSignIn(event)
        setEmail('')
      })
      .catch(err => console.log(err))
  }

  return (
    <div className='app'>
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <ModalPaper style={modalStyle}>
          <form className='appSignInForm'>
            <center style={{ backgroundColor: 'black' }}>
              <img className='app-header-image' src={BASE_URL + 'static/angrygram_logo.png'} alt='Angrygram' />
            </center>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={onSignIn}>Login</Button>
          </form>
        </ModalPaper>
      </Modal>
      <Modal open={openSignUp} onClose={() => setOpenSignUp(false)}>
        <ModalPaper style={modalStyle}>
          <form className='appSignInForm'>
            <center style={{ backgroundColor: 'black' }}>
              <img className='app-header-image' src={BASE_URL + 'static/angrygram_logo.png'} alt='Angrygram' />
            </center>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={onSignUp}>Sign Up</Button>
          </form>
        </ModalPaper>
      </Modal>
      <div className='app-header'>
        <img className='app-header-image' src={BASE_URL + 'static/angrygram_logo.png'} alt='Angrygram' />
        {authToken ? (
          <Button onClick={onSignOut}>Logout</Button>
        ) : (
          <div className='app-header-buttons'>
            <Button onClick={() => setOpenSignIn(true)}>Login</Button>
            <Button onClick={() => setOpenSignUp(true)}>Sign Up</Button>
          </div>
        )}
      </div>
      <div className='app-posts'>
        {posts.map(post => <Post key={post.id} post={post} authToken={authToken} authTokenType={authTokenType} />)}
      </div>
      {
        authToken
          ? (<ImageUpload
            authToken={authToken}
            authTokenType={authTokenType}
            apiService={serviceCtx.apiService}
          />)
          : (<h3 style={{ textAlign: 'center' }}>Please log in to be able to create posts</h3>)
      }
    </div>
  );
}

export default App