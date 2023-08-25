import React, { useEffect, useMemo, useRef, useState } from 'react'
import { categoriesService } from '../../services/categories.service'
import { DialogTitle, Dialog, DialogContent } from '@mui/material'
import TinyEditor from '../form/TinyEditor'
import { productsService } from '../../services/products.service'

export default function ModalProduct({
  data,
  isEdit,
  fetchData,
  isOpen,
  closeModal,
}) {
  const [item, setItem] = useState(
    isEdit
      ? { ...data, category: data.category?._id, parent: data.category?.parent }
      : {}
  )
  const [categories, setCategories] = useState([])
  const [parentCategories, setParentCategories] = useState([])
  const editorRef = useRef(null)

  useEffect(() => {
    getCategories()
  }, [])

  //   useEffect(() => {
  //     setItem({
  //       ...data,
  //       category: data.category._id,
  //       parent: data.category.parent,
  //     })
  //     console.log('data', data)
  //   }, [data, isEdit])

  const onFileChange = ({ target }) => {
    setItem({ ...item, file: target.files[0] })
  }

  const onFilesChange = ({ target }) => {
    setItem({ ...item, images: target.files })
  }

  const getCategories = () => {
    categoriesService
      .getChild()
      .then(({ data }) => {
        setCategories(data)
      })
      .catch((err) => console.log(err))
    categoriesService
      .getParents()
      .then(({ data }) => {
        setParentCategories(data)
      })
      .catch((err) => console.log(err))
  }

  const createNew = async () => {
    try {
      const keys = [
        'title',
        'price',
        'image',
        'category',
        'activeIngredient',
        'methodEntry',
        'chemicalClass',
        'preparationForm',
        'dangerClass',
        'consist',
        'fluid',
        'turn',
      ]
      const fm = new FormData()

      for (let [key, value] of Object.entries(item)) {
        if (key === 'file') fm.append('image', value)
        else if (keys.includes(key)) fm.append(key, value)
      }
      fm.append('description', editorRef?.current?.targetElm.value)

      if (isEdit) await productsService.update(fm, data._id)
      else await productsService.create(fm)
      fetchData()
      closeModal()
    } catch (err) {
      console.log(err)
    }
  }

  const checkItem = item.title

  const onSave = (e) => {
    e.preventDefault()
    console.log(editorRef.current)
    createNew()
  }

  const getCategoryTitle = (id) => {
    const parent = parentCategories.find((i) => i._id === id)
    if (parent) return parent.title
    const subCategory = categories.find((i) => i._id === id)
    if (subCategory) return subCategory.title
    return ''
  }

  const subCategories = useMemo(() => {
    const c = categories.filter((i) => i.parent?._id === item.parent)
    return c
  }, [item.parent, categories, item.category])

  return (
    <Dialog
      open={isOpen}
      onClose={closeModal}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <DialogTitle>
        {isEdit ? 'Изменить продукт' : 'Создать продукт'}
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
          <div className='row mb-3'>
            <label for='inputText' className='col-sm-4 col-form-label'>
              Цена
            </label>
            <div className='col-sm-8'>
              <input
                value={item.price}
                onChange={({ target }) =>
                  setItem({ ...item, price: target.value })
                }
                type='text'
                className='form-control'
              />
            </div>
          </div>
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
          <div className='row mb-3'>
            <label className='col-sm-4 col-form-label'>Категория</label>
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
                {parentCategories.map((i) => (
                  <option value={i._id}>{i.title}</option>
                ))}
              </select>
            </div>
          </div>
          <div className='row mb-3'>
            <label className='col-sm-4 col-form-label'>Подкатегория</label>
            <div className='col-sm-8'>
              <select
                value={item.category}
                onChange={({ target }) =>
                  setItem({ ...item, category: target.value })
                }
                className='form-select'
                aria-label='Default select example'
              >
                <option value={''} disabled selected>
                  Выберите категорию
                </option>
                {subCategories.map((i) => (
                  <option value={i._id}>{i.title}</option>
                ))}
              </select>
            </div>
          </div>
          <div className='row mb-3'>
            <label for='inputText' className='col-sm-4 col-form-label'>
              Очередь
            </label>
            <div className='col-sm-8'>
              <input
                value={item.turn}
                onChange={({ target }) =>
                  setItem({ ...item, turn: target.value })
                }
                type='text'
                className='form-control'
              />
            </div>
          </div>
          {getCategoryTitle(item.parent) === 'Агрария' && (
            <>
              <div className='row mb-3'>
                <label for='inputText' className='col-sm-4 col-form-label'>
                  Химический класс
                </label>
                <div className='col-sm-8'>
                  <input
                    value={item.chemicalClass}
                    onChange={({ target }) =>
                      setItem({ ...item, chemicalClass: target.value })
                    }
                    type='text'
                    className='form-control'
                  />
                </div>
              </div>
              <div className='row mb-3'>
                <label for='inputText' className='col-sm-4 col-form-label'>
                  Действующее вещество
                </label>
                <div className='col-sm-8'>
                  <input
                    value={item.activeIngredient}
                    onChange={({ target }) =>
                      setItem({ ...item, activeIngredient: target.value })
                    }
                    type='text'
                    className='form-control'
                  />
                </div>
              </div>
              <div className='row mb-3'>
                <label for='inputText' className='col-sm-4 col-form-label'>
                  Напишите препаративная форма
                </label>
                <div className='col-sm-8'>
                  <input
                    value={item.preparationForm}
                    onChange={({ target }) =>
                      setItem({ ...item, preparationForm: target.value })
                    }
                    type='text'
                    className='form-control'
                  />
                </div>
              </div>
              <div className='row mb-3'>
                <label for='inputText' className='col-sm-4 col-form-label'>
                  Напишите способ проникновения
                </label>
                <div className='col-sm-8'>
                  <input
                    value={item.methodEntry}
                    onChange={({ target }) =>
                      setItem({ ...item, methodEntry: target.value })
                    }
                    type='text'
                    className='form-control'
                  />
                </div>
              </div>
              <div className='row mb-3'>
                <label for='inputText' className='col-sm-4 col-form-label'>
                  Класс опасности
                </label>
                <div className='col-sm-8'>
                  <input
                    value={item.dangerClass}
                    onChange={({ target }) =>
                      setItem({ ...item, dangerClass: target.value })
                    }
                    type='text'
                    className='form-control'
                  />
                </div>
              </div>
            </>
          )}
          {getCategoryTitle(item.parent) === 'Ветеринария' && (
            <>
              <div className='row mb-3'>
                <label for='inputText' className='col-sm-4 col-form-label'>
                  Состав
                </label>
                <div className='col-sm-8'>
                  <input
                    value={item.consist}
                    onChange={({ target }) =>
                      setItem({ ...item, consist: target.value })
                    }
                    type='text'
                    className='form-control'
                  />
                </div>
              </div>
              <div className='row mb-3'>
                <label for='inputText' className='col-sm-4 col-form-label'>
                  Раствор
                </label>
                <div className='col-sm-8'>
                  <input
                    value={item.fluid}
                    onChange={({ target }) =>
                      setItem({ ...item, fluid: target.value })
                    }
                    type='text'
                    className='form-control'
                  />
                </div>
              </div>
            </>
          )}
          {getCategoryTitle(item.parent) === 'Удобрения' &&
            getCategoryTitle(item.parent) === 'Биостимуляторы' && (
              <>
                <div className='row mb-3'>
                  <label for='inputText' className='col-sm-4 col-form-label'>
                    Состав
                  </label>
                  <div className='col-sm-8'>
                    <input
                      value={item.consist}
                      onChange={({ target }) =>
                        setItem({ ...item, consist: target.value })
                      }
                      type='text'
                      className='form-control'
                    />
                  </div>
                </div>
              </>
            )}

          <div className='row mb-3'>
            <label for='inputText' className='col-sm-4 col-form-label'>
              Галерея
            </label>
            <div className='col-sm-8'>
              <input
                onChange={onFilesChange}
                type='file'
                multiple
                className='form-control'
              />
            </div>
          </div>

          <div className='row mb-3'>
            <label for='inputText' className='col-sm-12 col-form-label'>
              Описание
            </label>
            <div className='col-sm-12'>
              <TinyEditor
                onInit={(evt, editor) => (editorRef.current = editor)}
                initialValue={item.description}
                init={{
                  height: 500,
                  menubar: false,
                  plugins: [
                    'advlist',
                    'anchor',
                    'autolink',
                    'help',
                    'image',
                    'link',
                    'lists',
                    'table',
                  ],
                  toolbar:
                    'bold italic underline | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist table | ',
                  content_style:
                    'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                }}
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
  )
}
