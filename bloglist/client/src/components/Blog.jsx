import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import blogService from '../services/blogs'

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,

  marginBottom: 5,
}


const Blog = ({ blog, onDelete, onLike, user }) => {
  if (!blog) return null

  const showRemoveButton =
    user && blog.user && user.username === blog.user.username

  const handleRemove = async () => {
    try {
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
        await blogService.deleteBlog(blog.id)
        onDelete(blog.id)
      }
    } catch (error) {
      console.error('Error deleteing blog', error)
    }
  }

  return (

    <div className="blog" style={blogStyle} data-testid="blog">
      <Card elevation={4}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {blog.title}
          </Typography>

          <Typography variant="body2">
            by {blog.author}
          </Typography>
          <Typography variant="body2">
            {blog.url}
          </Typography>

          <Typography gutterBottom variant="body2">
            {'Added by '}{blog.user.username}
          </Typography>

          <Typography variant="body2">
            <span>{blog.likes} likes </span>
            {user ? <Button variant="outlined" size="small" onClick={() => onLike(blog)}>Like</Button> : null}
            {showRemoveButton && (
              <Button variant="outlined" color="error" size="small" onClick={handleRemove}>Remove</Button>
            )}
          </Typography>

        </CardContent>
      </Card>

    </div>
  )
}

export default Blog
