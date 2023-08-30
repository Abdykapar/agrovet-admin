import axios from 'axios'
import { store } from '../redux/store'
import { setToken, setUser } from '../redux/authReducer'

export const instance = axios.create({
  baseURL: process.env.REACT_APP_API,
})

instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const { message } = error.response.data
    if (message === 'jwt expired') {
      store.dispatch(setToken(null))
      store.dispatch(setUser(null))
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

instance.interceptors.request.use(
  function (config) {
    const state = store.getState()
    const token = state.auth.token
    if (token) config.headers.Authorization = 'Bearer_' + token
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)
