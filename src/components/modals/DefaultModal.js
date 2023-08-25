import React from 'react'

export default function DefaultModal({
  id = 'modal',
  title,
  children,
  footer = true,
}) {
  return (
    <div className='modal fade' id={id} tabIndex='-1'>
      <div className='modal-dialog modal-dialog-centered modal-lg'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>{title}</h5>
            <button
              type='button'
              className='btn-close'
              data-bs-dismiss='modal'
              aria-label='Close'
            ></button>
          </div>
          <div className='modal-body'>{children}</div>
          {footer && (
            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-secondary'
                data-bs-dismiss='modal'
              >
                Close
              </button>
              <button type='button' className='btn btn-primary'>
                Save changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
