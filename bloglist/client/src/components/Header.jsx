import { Link } from 'react-router-dom'
import { AppBar, Toolbar, Button, Typography } from '@mui/material'
import { useUser } from '../UserContext'

const Header = () => {
  const { user, logout } = useUser()

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Blog App
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Blogs
          </Button>
          <Button color="inherit" component={Link} to="/users">
            Users
          </Button>
          {user && (<Button color="inherit" component={Link} to="/newblog">
            New Blog
          </Button>)}
          {user ? (
            <Button color="inherit" onClick={logout}>
              LogOut
            </Button>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default Header
