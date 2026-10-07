import { Link  } from 'react-router-dom'
import { AppBar, Toolbar, Button, Typography } from '@mui/material'
const Header = ({ user, handleLogout }) => {
  const padding = { marginRight:10 }
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Blog App
          </Typography>
          <Button color="inherit" component={Link} to="/"> Blogs </Button>
          <Button color="inherit" component={Link} to="/newblog"> New Blog </Button>
          {user ? <Button color="inherit" onClick={handleLogout}>LogOut</Button> : <Button color="inherit" component={Link} to="/login">Login</Button>}
        </Toolbar>
      </AppBar>

    </div>
  )
}

export default Header
