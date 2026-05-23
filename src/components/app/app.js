import { useEffect, useState } from 'react'

import AngrygramApiService from '../../services'
import ImageUpload from '../image-upload'
import Header from '../header'
import PostsList from '../posts-list'
import SignInModal from '../sign-in-modal'
import SignUpModal from '../sign-up-modal'
import useAuth from '../../hooks/useAuth'

import './app.css'



export default function App() {
  const apiService = new AngrygramApiService()
  const serviceCtx = {
    apiService: apiService,
  }

  const [posts, setPosts] = useState([])
  const [openSignIn, setOpenSignIn] = useState(false)
  const [openSignUp, setOpenSignUp] = useState(false)
  
  const {
    authToken,
    authTokenType,
    username,
    isAuthenticated,
    handleSignInSuccess,
    handleSignUpSuccess,
    handleSignOut
  } = useAuth()

  useEffect(() => {
    apiService.getPosts()
      .then(data => data.sort((a, b) => b.timestamp.localeCompare(a.timestamp)))
      .then(data => setPosts(data))
      .catch(err => console.log(err))
  }, [])

  const handleCloseSignIn = () => setOpenSignIn(false)
  const handleCloseSignUp = () => setOpenSignUp(false)
  const handleOpenSignIn = () => setOpenSignIn(true)
  const handleOpenSignUp = () => setOpenSignUp(true)

  return (
    <div className='app'>
      <SignInModal
        open={openSignIn}
        onClose={handleCloseSignIn}
        onSignInSuccess={handleSignInSuccess}
        apiService={serviceCtx.apiService}
      />
      
      <SignUpModal
        open={openSignUp}
        onClose={handleCloseSignUp}
        onSignUpSuccess={handleSignUpSuccess}
        apiService={serviceCtx.apiService}
      />
      
      <Header
        authToken={authToken}
        username={username}
        onSignOut={handleSignOut}
        onOpenSignIn={handleOpenSignIn}
        onOpenSignUp={handleOpenSignUp}
      />
      
      <PostsList
        posts={posts}
        authToken={authToken}
        authTokenType={authTokenType}
        apiService={serviceCtx.apiService}
      />
      
      {isAuthenticated ? (
        <ImageUpload
          authToken={authToken}
          authTokenType={authTokenType}
          apiService={serviceCtx.apiService}
        />
      ) : (
        <h3 style={{ textAlign: 'center' }}>Please log in to be able to create posts</h3>
      )}
    </div>
  );
}
