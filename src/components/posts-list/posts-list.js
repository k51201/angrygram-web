import Post from '../post'
import './posts-list.css'

export default function PostsList({ posts, authToken, authTokenType, apiService }) {
  return (
    <div className='app-posts'>
      {posts.map(post => (
        <Post 
          key={post.id} 
          post={post} 
          authToken={authToken} 
          authTokenType={authTokenType}
          apiService={apiService}
        />
      ))}
    </div>
  )
}