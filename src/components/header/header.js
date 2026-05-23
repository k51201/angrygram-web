import { Button } from '@mui/material'
import './header.css'

const BASE_URL = 'http://192.168.1.107:8000/'

export default function Header({ 
  authToken, 
  username, 
  onSignOut, 
  onOpenSignIn, 
  onOpenSignUp 
}) {
  return (
    <div className='app-header'>
      <img 
        className='app-header-image' 
        src={BASE_URL + 'static/angrygram_logo.png'} 
        alt='Angrygram' 
      />
      {authToken ? (
        <div className='app-header-user'>
          <span className='app-header-username'>Welcome, {username}!</span>
          <Button onClick={onSignOut}>Logout</Button>
        </div>
      ) : (
        <div className='app-header-buttons'>
          <Button onClick={onOpenSignIn}>Login</Button>
          <Button onClick={onOpenSignUp}>Sign Up</Button>
        </div>
      )}
    </div>
  )
}