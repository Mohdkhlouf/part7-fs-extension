import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useMatch, Link } from 'react-router-dom'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogFrom from './components/BlogForm'
import Header from './components/Header'
import { Container } from '@mui/material'
import { TextField, Button, Alert } from '@mui/material'
import ErrorBoundary from './components/ErrorBoundary'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState('')

  const navigate = useNavigate()
  const match = useMatch('/blogs/:id')

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('NotesUserDataToken')
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('NotesUserDataToken', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      navigate('/')
      setNotification(`new welcome back ${user.name}`)
      setTimeout(() => {
        setNotification('')
      }, 5000)
    } catch (exception) {
      setNotification(exception.message)
      setTimeout(() => {
        setNotification('')
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
    blogService.setToken(null)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>Login From:</h2>
      <div>
        <TextField
          id="standard-basic"
          label="username:"
          variant="standard"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>

      <div>
        <TextField
          id="standard-basic"
          label="password:"
          variant="standard"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <div>
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
          {' '}
          Login{' '}
        </Button>
      </div>
    </form>
  )

  const createNewBlog = async newObject => {
    try {
      const createdBlog = await blogService.create(newObject)
      setBlogs([...blogs, createdBlog])
      setNotification(
        `new blog is added ${createdBlog.title} by ${createdBlog.author}`
      )
      setTimeout(() => {
        setNotification('')
      }, 5000)
      navigate('/')
    } catch (exception) {
      setNotification(exception.message)
      setTimeout(() => {
        setNotification('')
      }, 5000)
    }
  }

  const handleDelete = async blogId => {
    try {
      setBlogs(blogs.filter(blog => blog.id !== blogId))
      setNotification('Blog deleted successfully')
      setTimeout(() => {
        setNotification('')
      }, 5000)
      navigate('/')
    } catch (exception) {
      setNotification(exception.message)
      setTimeout(() => {
        setNotification('')
      }, 5000)
    }
  }

  const handleLike = async blogToLike => {
    try {
      const updatedBlog = await blogService.updateLike(
        blogToLike.id,
        blogToLike.likes
      )
      setBlogs(blogs.map(b => (b.id === blogToLike.id ? updatedBlog : b)))
    } catch (error) {
      console.error('Error updating likes:', error)
    }
  }

  const blogsFrom = () => (
    <div>
      <h2>blogs</h2>
      <p>{user && user.name} logged in</p>

      <ul>
        {[...blogs]
          .sort((a, b) => b.likes - a.likes)
          .map(blog => (
            <li key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>
                {blog.title} by {blog.author}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  )

  const blog = match ? blogs.find(blog => blog.id === match.params.id) : null
  return (
    <Container>
      <div>
        <div>
          <Header user={user} handleLogout={handleLogout} />
        </div>

        {notification && (
          <Alert
            style={{ marginTop: 10, marginBottom: 10 }}
            severity={notification.type}
          >
            {notification}
          </Alert>
        )}
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

            <Route path="/" element={blogsFrom()} />
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
