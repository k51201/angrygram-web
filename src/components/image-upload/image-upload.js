import { useState } from 'react'
import { Button, Input } from '@mui/material'
import './image-upload.css'

const BASE_URL = 'http://localhost:8000/'

const ImageUpload = ( authToken, authTokenType, apiService ) => {
    const [caption, setCaption] = useState('')
    const [image, setImage] = useState(null)

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setImage(event.target.files[0])
        }
    }

    const handleUpload = (event) => {
        event.preventDefault()

        const formData = new FormData()
        formData.append('image', image)

        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': `${authTokenType} ${authToken}`,
            },
            body: formData
        }

        fetch(BASE_URL + 'api/v1/post/image', requestOptions)
            .then(res => {
                if (res.ok) return res.json()
                else throw new Error('Image upload failed')
            })
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
        const postJson = JSON.stringify({
            imageUrl: imageUrl,
            imageUrlType: 'relative',
            caption: caption,
        })

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${authTokenType} ${authToken}`,
            },
            body: postJson
        }

        fetch(BASE_URL + 'api/v1/post', requestOptions)
            .then(res => {
                if (res.ok) return res.json()
                else throw new Error('Post creation failed')
            })
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