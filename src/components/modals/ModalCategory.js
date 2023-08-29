import React, { useEffect, useRef, useState } from 'react'
import { categoriesService } from '../../services/categories.service'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function ModalCategory() {
  const [item, setItem] = useState({ title: '' })
  const [categories, setCategories] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const id = searchParams.get('id')
    if (id) {
      categoriesService
        .getById(id)
        .then(({ data }) => {
          setItem({
            title: data.title,
            _id: data._id,
            subCategory: !!data.parent,
            parent: data.parent,
          })
          setIsEdit(true)
        })
        .catch((err) => console.log(err))
    }
  }, [searchParams])

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

      if (isEdit) await categoriesService.update(fm, searchParams.get('id'))
      else await categoriesService.create(fm)
      navigate('/category')
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

  return (
    <div id='main' className='main'>
      <section className='section dashboard'>
        <div className='row'>
          <div className='card'>
            <div className='card-body'>
              <h5 className='card-title'>
                {isEdit ? 'Изменить категорию' : 'Создать категорию'}
              </h5>
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
                {!!item.parent && (
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
                    onClick={() => navigate(-1)}
                    className='btn btn-secondary'
                  >
                    Отмена
                  </button>
                  <button
                    type='submit'
                    disabled={!checkItem}
                    className='btn btn-primary'
                  >
                    Cохранить
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
