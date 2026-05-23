import { useState } from 'react'
import { Button, Input, Modal } from '@mui/material'
import { getModalStyle, ModalPaper } from '../../utils/modal-styles'
import './sign-up-modal.css'

const BASE_URL = 'http://192.168.1.107:8000/'

export default function SignUpModal({ open, onClose, onSignUpSuccess, apiService }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [modalStyle] = useState(getModalStyle)

  const onSignUp = (event) => {
    event.preventDefault()

    apiService.signUp(username, email, password)
      .then(data => {
        onClose()
        setEmail('')
        setPassword('')
        setUsername('')
        
        // After successful signup, automatically sign in
        return apiService.login(username, password)
      })
      .then(data => {
        // TODO: Use cookies for token storage instead of localStorage
        data.access_token
          ? window.localStorage.setItem('authToken', data.access_token)
          : window.localStorage.removeItem('authToken')
        data.token_type
          ? window.localStorage.setItem('authTokenType', data.token_type)
          : window.localStorage.removeItem('authTokenType')
        data.username
          ? window.localStorage.setItem('username', data.username)
          : window.localStorage.removeItem('username')
        
        // Notify parent component of successful sign up and auto-login
        if (onSignUpSuccess) {
          onSignUpSuccess({
            accessToken: data.access_token,
            tokenType: data.token_type,
            username: data.username
          })
        }
      })
      .catch(err => console.log(err))
  }

  return (
    <Modal open={open} onClose={onClose}>
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
  )
}