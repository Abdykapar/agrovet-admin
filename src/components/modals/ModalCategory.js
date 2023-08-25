import React, { useEffect, useRef, useState } from 'react'
import { categoriesService } from '../../services/categories.service'
import { DialogTitle, Dialog, DialogContent } from '@mui/material'

export default function ModalCategory({
  data,
  isEdit,
  isParent = false,
  fetchData,
  isOpen,
  closeModal,
}) {
  const [item, setItem] = useState({ title: '' })
  const [categories, setCategories] = useState([])

  useEffect(() => {
    if (isEdit) setItem({ ...data, subCategory: !!data.parent })
  }, [data])

  const onFileChange = ({ target }) => {
    setItem({ ...item, file: target.files[0] })
  }

  const getCategories = () => {
    categoriesService
      .getParents()
      .then(({ data }) => {
        setCategories(data)
      })
      .catch((err) => console.log(err))
  }

  const createCategory = async () => {
    try {
      const fm = new FormData()
      fm.append('title', item.title)
      fm.append('image', item.file)
      fm.append('parent', item.parent || '')

      if (isEdit) await categoriesService.update(fm, data._id)
      else await categoriesService.create(fm)
      fetchData()
      closeModal()
    } catch (err) {
      console.log(err)
    }
  }

  const checkItem =
    item.title &&
    (isEdit ? true : item.file) &&
    (item.subCategory ? item.parent : true)

  const onSave = (e) => {
    e.preventDefault()
    createCategory()
  }

  useEffect(() => {
    if (item.subCategory) getCategories()
  }, [item])

  console.log(item)

  return (
    <Dialog
      open={isOpen}
      onClose={closeModal}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <DialogTitle>
        {isEdit ? 'Изменить категорию' : 'Создать категорию'}
      </DialogTitle>
      <DialogContent>
        <form onSubmit={onSave}>
          <div className='row mb-3'>
            <label for='inputText' className='col-sm-4 col-form-label'>
              Название
            </label>
            <div className='col-sm-8'>
              <input
                value={item.title}
                onChange={({ target }) =>
                  setItem({ ...item, title: target.value })
                }
                type='text'
                className='form-control'
              />
            </div>
          </div>
          {!isParent && (
            <div className='row mb-3' style={{ marginLeft: '0' }}>
              <div className='form-check form-switch'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  id='flexSwitchCheckDefault'
                  checked={item.subCategory}
                  onChange={({ target }) =>
                    setItem({ ...item, subCategory: target.checked })
                  }
                />
                <label
                  className='form-check-label'
                  for='flexSwitchCheckDefault'
                >
                  Подкатегория
                </label>
              </div>
            </div>
          )}
          {item.subCategory && (
            <div className='row mb-3'>
              <label className='col-sm-4 col-form-label'>
                Родительская категория
              </label>
              <div className='col-sm-8'>
                <select
                  value={item.parent}
                  onChange={({ target }) =>
                    setItem({ ...item, parent: target.value })
                  }
                  className='form-select'
                  aria-label='Default select example'
                >
                  <option disabled selected>
                    Выберите категорию
                  </option>
                  {categories.map((i) => (
                    <option value={i._id}>{i.title}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
          <div className='row mb-3'>
            <label for='inputText' className='col-sm-4 col-form-label'>
              Фото
            </label>
            <div className='col-sm-8'>
              <input
                onChange={onFileChange}
                type='file'
                className='form-control'
              />
            </div>
          </div>
          <div className='modal-footer'>
            <button
              type='button'
              onClick={closeModal}
              className='btn btn-secondary'
            >
              Close
            </button>
            <button
              type='submit'
              disabled={!checkItem}
              className='btn btn-primary'
            >
              Save changes
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    // <Dialog open={isOpen} onClose={closeModal}>
    //   To subscribe to this website, please enter your email address here. We
    //   will send updates occasionally.
    // </Dialog>
  )
}
