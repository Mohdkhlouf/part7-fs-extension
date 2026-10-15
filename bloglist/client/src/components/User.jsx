import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import userService from '../services/users'

const User = () => {
  const { id } = useParams()

  const result = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  })

  if (result.isLoading) return <div>Loading...</div>
  if (result.isError) return <div>Error: {result.error.message}</div>

  const user = result.data.find(user => user.id === id)
  if (!user) return <div>User not found</div>

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>Added blogs</h3>
      <ul>
        {user.blogs.map(blog => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User
