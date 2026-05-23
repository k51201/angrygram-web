import React, { useEffect, useState } from 'react'
import { Avatar, Button } from '@mui/material'

import './post.css'

const BASE_URL = 'http://192.168.1.107:8000/'

export default function Post({ post, authToken, authTokenType, apiService }) {
    const [imageUrl, setImageUrl] = useState('')
    const [comments, setComments] = useState([])
    const [commentText, setCommentText] = useState('')

    useEffect(() => {
        if (post.imageUrlType === 'absolute') {
            setImageUrl(post.imageUrl)
        } else {
            setImageUrl(BASE_URL + post.imageUrl)
        }
    }, [post.imageUrl, post.imageUrlType])

    useEffect(() => {
        setComments(post.comments)
    }, [post.comments])

    const handleDelete = (event) => {
        event.preventDefault()

        apiService.deletePost(authToken, authTokenType, post.id)
            .then(success => {
                if (success) window.location.reload()
            })
            .catch(err => console.log(err))
    }

    const postComment = (event) => {
        event.preventDefault()

        apiService.postComment(authToken, authTokenType, post.id, commentText)
            .then(data => {
                // setComments([...comments, data])
                setCommentText('')
                fetchComments()
            })
            .catch(err => console.log(err))
            .finally(() => setCommentText(''))
    }

    const fetchComments = () => {
        apiService.getComments(authToken, authTokenType, post.id)
            .then(data => setComments(data))
            .catch(err => console.log(err))
    }

    return (
        <div key={post.id} className="post">
            <div className='post-header'>
                <Avatar alt='Alex' src={null} />
                <div className='post-header-info'>
                    <h3>{post.user.username}</h3>
                    <Button className='post-delete' onClick={handleDelete}>Delete</Button>
                </div>
            </div>
            <img className='post-image' src={imageUrl} alt='Post' />
            <h4 className='post-text'>{post.caption}</h4>
            {comments.length > 0 && (
                <div className='post-comments'>
                    {comments.map((comment) => (
                        <p key={comment.id} className='post-comment'>
                            <strong>{comment.username}:</strong> {comment.text}
                        </p>
                    ))}
                </div>
            )}
            {authToken && (
                <form className='post-comment-box'>
                    <input
                        type='text'
                        className='post-comment-input'
                        placeholder='Add a comment...'
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                    />
                    <button
                        className='post-comment-button'
                        type='submit'
                        disabled={!commentText.trim()}
                        onClick={postComment}
                    >Post</button>
                </form>
            )}
        </div>
    )
}
