import React, { useEffect, useState } from 'react'
import { Avatar, Button } from '@mui/material'

import './post.css'

const BASE_URL = 'http://localhost:8000/'

const Post = ({ post, authToken, authTokenType }) => {
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

        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Authorization': `${authTokenType} ${authToken}`,
            },
        }

        fetch(BASE_URL + 'api/v1/post/' + post.id, requestOptions)
            .then(res => {
                if (res.ok) window.location.reload()
                else throw new Error('Post deletion failed')
            })
            .catch(err => console.log(err))
    }

    const postComment = (event) => {
        event.preventDefault()

        const commentJson = JSON.stringify({
            text: commentText,
            postId: post.id,
        })

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${authTokenType} ${authToken}`,
            },
            body: commentJson
        }

        fetch(BASE_URL + 'api/v1/post/' + post.id + '/comment', requestOptions)
            .then(res => {
                if (res.ok) return res.json()
                else throw new Error('Comment posting failed')
            })
            .then(data => {
                // setComments([...comments, data])
                setCommentText('')
                fetchComments()
            })
            .catch(err => console.log(err))
            .finally(() => setCommentText(''))
    }

    const fetchComments = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': `${authTokenType} ${authToken}`,
            },
        }

        fetch(BASE_URL + 'api/v1/post/' + post.id + '/comment', requestOptions)
            .then(res => {
                if (res.ok) return res.json()
                else throw new Error('Failed to fetch comments')
            })
            .then(data => setComments(data))
            .catch(err => console.log(err))
    }

    return (
        <div className="post">
            <div className='post-header'>
                <Avatar alt='Alex' src='' />
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
                        <p>
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

export default Post