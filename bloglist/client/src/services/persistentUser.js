const KEY = 'BlogsUserDataToken'

const getUser = () => {
  const saved = window.localStorage.getItem(KEY)
  return saved ? JSON.parse(saved) : null
}

const saveUser = user => {
  window.localStorage.setItem(KEY, JSON.stringify(user))
}

const removeUser = () => {
  window.localStorage.removeItem(KEY)
}

export default { getUser, saveUser, removeUser }
