import axios from 'axios'
const baseUrl = '/api/login'

const login = async credintials => {
  const response = await axios.post(baseUrl, credintials)
  return response.data
}

export default { login }
