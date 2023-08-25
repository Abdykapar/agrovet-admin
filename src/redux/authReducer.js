import { createSlice } from '@reduxjs/toolkit'

const token = localStorage.getItem('token')
const user = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : {}

const authSlice = createSlice({
  name: 'global',
  initialState: {
    token: token || null,
    user,
  },
  reducers: {
    setToken: (state, action) => {
      localStorage.setItem('token', action.payload)
      state.token = action.payload
    },
    setUser: (state, action) => {
      localStorage.setItem('user', JSON.stringify(action.payload))
      state.user = action.payload
    },
  },
})

export const { setToken, setUser } = authSlice.actions

export default authSlice.reducer
