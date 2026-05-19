import './sign-in-modal.css'

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

export default SignInModal = ({ open, onClose }) => {

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

    return (
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
    )
}