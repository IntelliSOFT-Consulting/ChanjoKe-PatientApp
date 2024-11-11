import axios from 'axios'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'

const server = axios.create({
  baseURL: import.meta.env.VITE_SERVER_BASE_URL,
  headers: {
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
    'Accept': '*',
  }
})

server.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      message.error(error.response.status === 401 ? 'Unauthorized: Incorrect credentials' : error.response.data.error)
    } else {
      message.error('Network Error')
    }
    return Promise.reject(error)
  }
)

export const useApiRequest = () => {
  // abort controller
  const abortController = new AbortController()
  const navigate = useNavigate()

  const get = async (url) => {
    try {
      const response = await server.get(url, {
        signal: abortController.signal,
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('auth'))?.access_token}`
        }
      })
      return response.data
    } catch (error) {
      if (error?.response?.status === 401) {
        localStorage.clear()
        navigate('/user-auth')
      }
    }
  }

  const post = async (url, data) => {
    try {
      const response = await server.post(url, data, {
        signal: abortController.signal,
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('auth'))?.access_token}`
        }
      })
      return response.data
    } catch (error) {
      if (error?.response?.status === 401) {
        localStorage.clear()
        // navigate('/auth')
      }
    }
  }

  const put = async (url, data) => {
    try {
      const response = await server.put(url, data, {
        signal: abortController.signal,
      })
      return response.data
    } catch (error) {
      if (error?.response?.status === 401) {
        localStorage.clear()
        navigate('/user-auth')
      }
    }
  }

  const remove = async (url) => {
    try {
      const response = await server.delete(url, {
        signal: abortController.signal,
      })
      return response.data
    } catch (error) {
      if (error?.response?.status === 401) {
        localStorage.clear()
        navigate('/user-auth')
      }
    }
  }

  return { get, post, put, remove }
}
