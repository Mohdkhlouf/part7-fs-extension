import { useQuery } from '@tanstack/react-query'
import userService from '../services/users'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom'

const UsersPage = () => {
  function createData(name, Username, blogsCounter) {
    return { name, Username, blogsCounter };
  }


 const result = useQuery(
    {
      queryKey: ['users'],
      queryFn: userService.getAll,
    }
  )
  if (result.isLoading) return <div>Loading...</div>
  if (result.isError) return <div>Error: {result.error.message}</div>

  const users = result.data

  return (
    <div>
      <h2>Users List</h2>

      <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell><b>Name</b></TableCell>
                  <TableCell ><b>Username</b></TableCell>
                  <TableCell ><b>Blogs created</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Link to={`/users/${user.id}`}>
                        {user.name}
                      </Link>
                    </TableCell>
                    <TableCell >{user.username}</TableCell>
                    <TableCell >{user.blogs.length}</TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

    </div>
)

}


export default UsersPage
