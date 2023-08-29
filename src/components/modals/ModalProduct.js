import React, { useEffect, useMemo, useRef, useState } from 'react'
import { categoriesService } from '../../services/categories.service'
import TinyEditor from '../form/TinyEditor'
import { productsService } from '../../services/products.service'
import Select from 'react-select'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function ModalProduct() {
  const [item, setItem] = useState({})
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState(null)
  const [parentCategories, setParentCategories] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const editorRef = useRef(null)

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const id = searchParams.get('id')
    console.log('id', id)
    if (id) {
      productsService
        .getById(id)
        .then(({ data }) => {
          setItem({
            ...data,
            category: data.category?._id,
            parent: data.category?.parent,
          })
          getCategories(data)
          setIsEdit(true)
        })
        .catch((err) => console.log(err))
    } else getCategories()
  }, [searchParams])

  const onFileChange = ({ target }) => {
    setItem({ ...item, file: target.files[0] })
  }

  const onFilesChange = ({ target }) => {
    setItem({ ...item, images: target.files })
  }

  const getCategories = async (data) => {
    const subs = categoriesService.getChild().then(({ data }) => data)
    const cats = categoriesService.getParents().then(({ data }) => data)

    try {
      const [sValues, cValues] = await Promise.all([subs, cats])
      setCategories(
        sValues.map((i) => ({ ...i, value: i._id, label: i.title }))
      )
      setParentCategories(
        cValues.map((i) => ({ value: i._id, label: i.title }))
      )
      const category = sValues.find((i) => i._id === data?.category)
      if (category) {
        const parent = cValues.find((i) => i._id === category.parent._id)
        if (parent)
          setSelectedCategory({ value: parent._id, label: parent.title })
        setSelectedSubCategory({ value: category._id, label: category.title })
      }
    } catch (err) {
      console.log(err)
    }
  }

  const createNew = async () => {
    try {
      const keys = [
        'title',
        'price',
        'image',
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
      fm.append('category', selectedSubCategory.value)

      if (isEdit) await productsService.update(fm, item._id)
      else await productsService.create(fm)
      navigate('/')
    } catch (err) {
      console.log(err)
    }
  }

  const checkItem = item.title

  const onSave = (e) => {
    e.preventDefault()
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
    return categories.filter((i) => i.parent?._id === selectedCategory?.value)
  }, [selectedCategory, categories, selectedSubCategory])

  return (
    <div id='main' className='main'>
      <section className='section dashboard'>
        <div className='row'>
          <div className='card'>
            <div className='card-body'>
              <h5 className='card-title'>
                {isEdit ? 'Изменить продукт' : 'Создать продукт'}
              </h5>
              <div>
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
                  {/* <div className='row mb-3'>
                    <label for='inputText' className='col-sm-4 col-form-label'>
                      Цена
                    </label>
                    <div className='col-sm-8'>
                      <input
                        value={item.price}
                        onChange={({ target }) =>
                          setItem({ ...item, price: target.value })
                        }
                        type='number'
                        className='form-control'
                      />
                    </div>
                  </div> */}
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
                      <Select
                        options={parentCategories}
                        value={selectedCategory}
                        onChange={setSelectedCategory}
                        placeholder='Выберите категорию'
                      />
                    </div>
                  </div>
                  <div className='row mb-3'>
                    <label className='col-sm-4 col-form-label'>
                      Подкатегория
                    </label>
                    <div className='col-sm-8'>
                      <Select
                        options={subCategories}
                        value={selectedSubCategory}
                        onChange={setSelectedSubCategory}
                        placeholder='Выберите подкатегорию'
                      />
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
                        type='number'
                        className='form-control'
                      />
                    </div>
                  </div>
                  {getCategoryTitle(item.parent) === 'Агрария' && (
                    <>
                      <div className='row mb-3'>
                        <label
                          for='inputText'
                          className='col-sm-4 col-form-label'
                        >
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
                        <label
                          for='inputText'
                          className='col-sm-4 col-form-label'
                        >
                          Действующее вещество
                        </label>
                        <div className='col-sm-8'>
                          <input
                            value={item.activeIngredient}
                            onChange={({ target }) =>
                              setItem({
                                ...item,
                                activeIngredient: target.value,
                              })
                            }
                            type='text'
                            className='form-control'
                          />
                        </div>
                      </div>
                      <div className='row mb-3'>
                        <label
                          for='inputText'
                          className='col-sm-4 col-form-label'
                        >
                          Напишите препаративная форма
                        </label>
                        <div className='col-sm-8'>
                          <input
                            value={item.preparationForm}
                            onChange={({ target }) =>
                              setItem({
                                ...item,
                                preparationForm: target.value,
                              })
                            }
                            type='text'
                            className='form-control'
                          />
                        </div>
                      </div>
                      <div className='row mb-3'>
                        <label
                          for='inputText'
                          className='col-sm-4 col-form-label'
                        >
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
                        <label
                          for='inputText'
                          className='col-sm-4 col-form-label'
                        >
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
                        <label
                          for='inputText'
                          className='col-sm-4 col-form-label'
                        >
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
                        <label
                          for='inputText'
                          className='col-sm-4 col-form-label'
                        >
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
                          <label
                            for='inputText'
                            className='col-sm-4 col-form-label'
                          >
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
                      onClick={() => navigate(-1)}
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
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
