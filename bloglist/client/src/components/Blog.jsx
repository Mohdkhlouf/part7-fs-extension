import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useUser } from '../UserContext'
import { useNotify } from '../NotificationContext'
import blogService from '../services/blogs'

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  marginBottom: 5
}

const Blog = ({ blog, onDelete, onLike }) => {
  const { user } = useUser()
  const notify = useNotify()
  const queryClient = useQueryClient()
  const [comment, setComment] = useState('')

  const commentMutation = useMutation({
    mutationFn: ({ id, comment }) => blogService.addComment(id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      setComment('')
      notify('comment added')
    },
    onError: error => {
      notify(error.response?.data?.error || error.message, 'error')
    },
  })

  if (!blog) return null

  const showRemoveButton =
    user && blog.user && user.username === blog.user.username

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      onDelete(blog.id)
    }
  }

  const addComment = event => {
    event.preventDefault()
    if (!comment.trim()) {
      notify('comment cannot be empty', 'error')
      return
    }
    commentMutation.mutate({ id: blog.id, comment })
  }

  return (
    <div className="blog" style={blogStyle} data-testid="blog">
      <Card elevation={4}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {blog.title}
          </Typography>

          <Typography variant="body2">by {blog.author}</Typography>
          <Typography variant="body2">{blog.url}</Typography>

          <Typography gutterBottom variant="body2">
            {'Added by '}
            {blog.user?.username}
          </Typography>

          <Typography variant="body2">
            <span>{blog.likes} likes </span>
            {user && (
              <Button variant="outlined" size="small" onClick={() => onLike(blog)}>
                Like
              </Button>
            )}
            {showRemoveButton && (
              <Button variant="outlined" color="error" size="small" onClick={handleRemove}>
                Remove
              </Button>
            )}
          </Typography>

          <h2>comments</h2>
          <form onSubmit={addComment}>
            <input
              type="text"
              placeholder="Add a comment"
              value={comment}
              onChange={({ target }) => setComment(target.value)}
            />
            <Button type="submit" variant="outlined" size="small">
              Add Comment
            </Button>
          </form>
          <ul>
            {(blog.comments ?? []).map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export default Blog
