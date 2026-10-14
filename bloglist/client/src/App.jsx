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

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const notify = useNotify()
  const navigate = useNavigate()
  const match = useMatch('/blogs/:id')
  const queryClient = useQueryClient()

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('NotesUserDataToken')
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser)
      setUser(user)
      blogService.setToken(user.token)
    }
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

if (result.isLoading) return <div>Loading...</div>

if (result.isError) return <div>Error: {result.error.message}</div>


const blogs = result.data

const createNewBlog = newObject => {
    newBlogMutation.mutate(newObject)
}

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
      notify(`welcome back ${user.name}`)
    } catch (exception) {
      notify(exception.response?.data?.error || exception.message, 'error')
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
    const blogToDelete = blogs.find(b => b.id === blogId)
    try {
      await blogService.deleteBlog(blogId)
      setBlogs(blogs.filter(b => b.id !== blogId))
      notify(`blog ${blogToDelete.title} by ${blogToDelete.author} deleted`)
      navigate('/')
    } catch (exception) {
      notify(exception.response?.data?.error || exception.message, 'error')
    }
  }

  const handleLike = async blogToLike => {
    try {
      const updatedBlog = await blogService.updateLike(
        blogToLike.id,
        blogToLike.likes
      )
      setBlogs(blogs.map(b => (b.id === blogToLike.id ? updatedBlog : b)))
      notify(`you liked ${updatedBlog.title}`)
    } catch (exception) {
      notify(exception.response?.data?.error || exception.message, 'error')
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
