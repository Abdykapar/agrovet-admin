import { createSlice } from '@reduxjs/toolkit'

const token = localStorage.getItem('token')

const authSlice = createSlice({
  name: 'global',
  initialState: {
    token: token || null,
  },
  reducers: {
    setToken: (state, action) => {
      localStorage.setItem('token', action.payload)
      state.token = action.payload
    },
  },
})

export const { setToken } = authSlice.actions

export default authSlice.reducer
