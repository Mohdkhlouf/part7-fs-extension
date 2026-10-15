import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useMatch, Link } from 'react-router-dom'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogFrom from './components/BlogForm'
import Header from './components/Header'
import Notification from './components/Notification'
import { Container, TextField, Button } from '@mui/material'
import ErrorBoundary from './components/ErrorBoundary'
import { useNotify } from './NotificationContext'
import { useQuery, useMutation,useQueryClient } from '@tanstack/react-query'
import { useUser } from './UserContext'
import UsersPage from './components/UsersPage'
import User from './components/User'
import persistentUser from './services/persistentUser'
import { List, ListItem, ListItemButton, ListItemText, Paper, Typography } from '@mui/material'


const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const notify = useNotify()
  const navigate = useNavigate()
  const match = useMatch('/blogs/:id')
  const queryClient = useQueryClient()
  const { user, login } = useUser()

  useEffect(() => {
    const saved = persistentUser.getUser()
    if (saved) login(saved)
  }, [])

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })



const newBlogMutation = useMutation({
  mutationFn: blogService.create,
  onSuccess: createdBlog => {
    queryClient.invalidateQueries({ queryKey: ['blogs'] })
    notify(`new blog is added ${createdBlog.title} by ${createdBlog.author}`)
    navigate('/')
  },
  onError: error => {
    notify(error.response?.data?.error || error.message, 'error')
  }
  })


  const deleteBlogMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      notify('blog deleted successfully')
      navigate('/')
    },
    onError: error => {
      notify(error.response?.data?.error || error.message, 'error')
    }
  })



  const updateLikeMutation = useMutation({
    mutationFn: blogToLike => blogService.updateLike(blogToLike.id,blogToLike.likes),
    onSuccess: updatedBlog => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      notify(`you liked ${updatedBlog.title}`)
    },
    onError: error => {
      notify(error.response?.data?.error || error.message, 'error')
    }
  })

if (result.isLoading) return <div>Loading...</div>

if (result.isError) return <div>Error: {result.error.message}</div>


const blogs = result.data

const createNewBlog = newObject => {
    newBlogMutation.mutate(newObject)
}

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const loggedInUser = await loginService.login({ username, password })
      login(loggedInUser)
      setUsername('')
      setPassword('')
      navigate('/')
      notify(`welcome back ${loggedInUser.name}`)
    } catch (exception) {
      notify(exception.response?.data?.error || exception.message, 'error')
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>Login From:</h2>
      <div>
        <TextField
          id="username"
          label="username:"
          variant="standard"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>

      <div>
        <TextField
          id="password"
          type="password"
          label="password:"
          variant="standard"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <div>
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
          Login
        </Button>
      </div>
    </form>
  )

  const handleDelete = async blogId => {
    deleteBlogMutation.mutate(blogId)
  }








  const handleLike = async blogToLike => {
      updateLikeMutation.mutate(blogToLike)
  }

  const blogsFrom = () => (
    <div>
      <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
        Blogs
      </Typography>

      {user && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {user.name} logged in
        </Typography>
      )}

      <Paper>
        <List>
          {[...blogs]
            .sort((a, b) => b.likes - a.likes)
            .map(blog => (
              <ListItem key={blog.id} disablePadding divider>
                <ListItemButton component={Link} to={`/blogs/${blog.id}`}>
                  <ListItemText
                    primary={blog.title}
                    secondary={`${blog.author} · ${blog.likes} likes`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      </Paper>
    </div>
  )


  const blog = match ? blogs.find(blog => blog.id === match.params.id) : null

  return (
    <Container>
      <div>
        <div>
          <Header />
        </div>

        <Notification />

        <ErrorBoundary>
          <Routes>
            <Route
              path="/blogs/:id"
              element={
                <Blog
                  blog={blog}
                  onDelete={handleDelete}
                  onLike={handleLike}
                  user={user}
                />
              }
            />

            <Route path="/users/:id"  element={<User/>} />
            <Route path="/" element={blogsFrom()} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/login" element={loginForm()} />
            {user ? (
              <Route
                path="/newblog"
                element={<BlogFrom createBlog={createNewBlog} />}
              />
            ) : null}
            <Route
              path="*"
              element={
                <div>
                  <h2>404 - Page not found</h2>
                </div>
              }
            />
          </Routes>
        </ErrorBoundary>
      </div>
    </Container>
  )
}

export default App
