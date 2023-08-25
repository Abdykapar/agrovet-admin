import React from 'react'
import { useSelector } from 'react-redux'
import Login from '../pages/Login'
import { useNavigate } from 'react-router-dom'

export default function ProtectRoute({ children }) {
  const navigate = useNavigate()
  const token = useSelector((s) => s.auth.token)
  if (!token) return (window.location.href = '/login')
  return children
}
