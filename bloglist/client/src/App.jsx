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

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const notify = useNotify()
  const navigate = useNavigate()
  const match = useMatch('/blogs/:id')
  const queryClient = useQueryClient()
  const { user, login, logout } = useUser()

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('BlogsUserDataToken')
    if (loggedInUser) {
      login(JSON.parse(loggedInUser))
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

  const handleLogout = () => {
    logout()
    notify('logged out successfully')
    navigate('/login')
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
