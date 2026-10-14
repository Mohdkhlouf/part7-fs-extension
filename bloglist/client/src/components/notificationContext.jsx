

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'STE':
      return action.payload
    case 'CLEAR':
      return null
    default:
      return state
  }
}

export default notificationReducer
