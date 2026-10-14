import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useUser } from '../UserContext'

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  marginBottom: 5
}

const Blog = ({ blog, onDelete, onLike }) => {
  const {user} = useUser()
  if (!blog) return null

  const showRemoveButton =
    user && blog.user && user.username === blog.user.username

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      onDelete(blog.id)
    }
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
            {user ? (
              <Button
                variant="outlined"
                size="small"
                onClick={() => onLike(blog)}
              >
                Like
              </Button>
            ) : null}
            {showRemoveButton && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={handleRemove}
              >
                Remove
              </Button>
            )}
          </Typography>
        </CardContent>
      </Card>
    </div>
  )
}

export default Blog
