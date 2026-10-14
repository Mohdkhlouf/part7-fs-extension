import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'CLEAR':
      return null
    default:
      return state
  }
}

const NotificationContext = createContext()

let timeoutId = null

export const NotificationContextProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, null)

  const notify = (message, type = 'success') => {
    dispatch({ type: 'SET', payload: { message, type } })
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
  }

  return (
    <NotificationContext.Provider value={{ notification, notify }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotify = () => useContext(NotificationContext).notify

export default NotificationContext
