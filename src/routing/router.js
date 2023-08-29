import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import Category from '../pages/Category'
import Login from '../pages/Login'
import ProtectRoute from './ProtectRoute'
import ModalCategory from '../components/modals/ModalCategory'
import ModalProduct from '../components/modals/ModalProduct'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectRoute>
        <App>
          <Home />
        </App>
      </ProtectRoute>
    ),
  },
  {
    path: '/category',
    element: (
      <ProtectRoute>
        <App>
          <Category />
        </App>
      </ProtectRoute>
    ),
  },
  {
    path: '/category/create',
    element: (
      <ProtectRoute>
        <App>
          <ModalCategory />
        </App>
      </ProtectRoute>
    ),
  },
  {
    path: '/product/create',
    element: (
      <ProtectRoute>
        <App>
          <ModalProduct />
        </App>
      </ProtectRoute>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
])
