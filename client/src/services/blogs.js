import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = newToken
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (data) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  const response = await axios.post(baseUrl, data, config)
  return response.data
}

const like = async (blog) => {
  const response = await axios.put(baseUrl + `/${blog.id}`, {
    ...blog,
    likes: blog.likes + 1,
  })
  return response.data
}

const remove = async (blog) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  const response = await axios.delete(baseUrl + `/${blog.id}`, config)
  return response.data
}

export default { getAll, create, setToken, like, remove }
