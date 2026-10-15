import { createContext, useReducer, useContext } from 'react'
import blogService from './services/blogs'
import persistentUser from './services/persistentUser'

const userReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return action.payload
    case 'LOGOUT':
      return null
    default:
      return state
  }
}

const UserContext = createContext()

export const UserContextProvider = ({ children }) => {
  const [user, dispatch] = useReducer(userReducer, null)

  const login = user => {
    persistentUser.saveUser(user)
    blogService.setToken(user.token)
    dispatch({ type: 'LOGIN', payload: user })
  }

  const logout = () => {
    persistentUser.removeUser()
    blogService.setToken(null)
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)

export default UserContextProvider
