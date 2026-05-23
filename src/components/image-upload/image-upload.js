import { useState } from 'react'
import { Button, Input } from '@mui/material'
import './image-upload.css'

const BASE_URL = 'http://192.168.1.107:8000/'

const ImageUpload = ({ authToken, authTokenType, apiService }) => {
    const [caption, setCaption] = useState('')
    const [image, setImage] = useState(null)

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setImage(event.target.files[0])
        }
    }

    const handleUpload = (event) => {
        event.preventDefault()

        apiService.postImage(authToken, authTokenType, image)
            .then(data => {
                createPost(data.imageUrl)
            })
            .catch(err => console.log(err))
            .finally(() => {
                setImage(null)
                setCaption('')
                document.getElementById('file-input').value = null
            })
    }

    const createPost = (imageUrl) => {
        apiService.createPost(authToken, authTokenType, imageUrl, caption)
            .then(data => {
                window.location.reload()
                window.scrollTo(0, 0)
            })
            .catch(err => console.log(err))
    }

    return (
        <div className='image-upload'>
            <Input
                type='text'
                placeholder='Enter a caption...'
                value={caption}
                name='caption'
                onChange={(event) => setCaption(event.target.value)}
            />
            <Input type='file' id='file-input' name='file' onChange={handleFileChange} accept='image/*' />
            <Button className='image-upload-button' onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default ImageUpload