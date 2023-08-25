import React from 'react'

export default function Sidebar() {
  return (
    <aside id='sidebar' className='sidebar'>
      <ul className='sidebar-nav' id='sidebar-nav'>
        <li className='nav-item'>
          <a className='nav-link ' href='/'>
            <i className='bi bi-grid'></i>
            <span>Товары</span>
          </a>
        </li>
        <li className='nav-item'>
          <a className='nav-link collapsed' href='/category'>
            <i className='bi bi-grid'></i>
            <span>Категория</span>
          </a>
        </li>
      </ul>
    </aside>
  )
}
