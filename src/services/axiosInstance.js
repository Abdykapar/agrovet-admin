import axios from 'axios'
import { store } from '../redux/store'

export const instance = axios.create()

instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
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
