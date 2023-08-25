import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/index.css'
import reportWebVitals from './reportWebVitals'
import { router } from './routing/router'
import { RouterProvider } from 'react-router-dom'
import { store } from './redux/store'
import { Provider } from 'react-redux'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
)

reportWebVitals()
