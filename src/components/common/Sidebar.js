import React from 'react'
import { useLocation } from 'react-router-dom'

export default function Sidebar() {
  const location = useLocation()
  return (
    <aside id='sidebar' className='sidebar'>
      <ul className='sidebar-nav' id='sidebar-nav'>
        <li className='nav-item'>
          <a
            className={
              location.pathname === '/' ? 'nav-link' : 'nav-link collapsed'
            }
            href='/'
          >
            <i className='bi bi-grid'></i>
            <span>Товары</span>
          </a>
        </li>
        <li className='nav-item'>
          <a
            className={
              location.pathname === '/category'
                ? 'nav-link'
                : 'nav-link collapsed'
            }
            href='/category'
          >
            <i className='bi bi-grid'></i>
            <span>Категория</span>
          </a>
        </li>
      </ul>
    </aside>
  )
}
