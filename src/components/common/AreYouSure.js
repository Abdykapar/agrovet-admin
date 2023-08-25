import React from 'react'
import { Dialog, DialogActions, DialogTitle } from '@mui/material'

export default function AreYouSure({ isOpen, onClose, onYes }) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle sx={{ width: '350px' }} id='alert-dialog-title'>
        Вы уверены?
      </DialogTitle>

      <DialogActions>
        <button className='btn btn-default' onClick={onClose}>
          Нет
        </button>
        <button className='btn btn-primary' onClick={onYes}>
          Да
        </button>
      </DialogActions>
    </Dialog>
  )
}
