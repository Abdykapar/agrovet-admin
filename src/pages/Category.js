import React, { useEffect, useState } from 'react'
import { categoriesService } from '../services/categories.service'
import ModalCategory from '../components/modals/ModalCategory'
import AreYouSure from '../components/common/AreYouSure'

export default function Category() {
  const [data, setData] = useState([])
  const [currentItem, setCurrentItem] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isOnDelete, setIsOnDelete] = useState(false)

  const fetchData = () => {
    categoriesService
      .getAll()
      .then(({ data }) => {
        const category = data.filter((i) => !i.parent)
        setData(
          category.map((i) => ({
            ...i,
            subCategories: data.filter((j) => j.parent === i._id),
          }))
        )
      })
      .catch((err) => console.log(err))
  }
  useEffect(() => {
    fetchData()
  }, [])

  const onEdit = (item) => {
    setCurrentItem(item)
    setIsOpen(true)
  }

  const onCreate = () => {
    setCurrentItem(null)
    setIsOpen(true)
  }

  const onDelete = (item) => {
    setCurrentItem(item)
    setIsOnDelete(true)
  }

  const deleteItem = () => {
    categoriesService
      .delete(currentItem._id)
      .then(() => {
        fetchData()
        setCurrentItem(null)
        setIsOnDelete(false)
      })
      .catch((err) => console.log(err))
  }

  return (
    <main id='main' className='main'>
      <section className='section dashboard'>
        <div className='row'>
          <div className='card'>
            <div className='card-body'>
              <div className='flex justify-between align-center'>
                <h5 className='card-title'>Категория</h5>
                <button className='btn btn-primary' onClick={onCreate}>
                  <i className='bi bi-plus-lg mr-10'></i>
                  <span className='inline-block'>Добавить категорию</span>
                </button>
              </div>

              <table className='table'>
                <thead>
                  <tr>
                    <th scope='col'>#</th>
                    <th scope='col'>Название</th>
                    <th scope='col'>Под категория</th>
                    <th scope='col'>Фото</th>
                    <th scope='col'></th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((i, ind) => (
                    <tr key={i._id}>
                      <th scope='row'>{ind + 1}</th>
                      <td>{i.title}</td>
                      <td>
                        <ul>
                          {i.subCategories.map((j) => (
                            <li
                              key={j._id}
                              className='flex justify-between gap-10'
                            >
                              <span>{j.title}</span>
                              <div>
                                <button
                                  className='btn btn-default'
                                  onClick={() => onEdit(j)}
                                >
                                  <i className='bi bi-pencil-square'></i>
                                </button>
                                <button
                                  onClick={() => onDelete(j)}
                                  className='btn btn-default'
                                >
                                  <i className='bi bi-trash'></i>
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td>
                        <img
                          src={`${process.env.REACT_APP_FILE_URL}${i.image}`}
                          height={'80px'}
                        />
                      </td>
                      <td>
                        <button
                          className='btn btn-default'
                          onClick={() => onEdit(i)}
                        >
                          <i className='bi bi-pencil-square'></i>
                        </button>
                        <button
                          onClick={() => onDelete(i)}
                          className='btn btn-default'
                        >
                          <i className='bi bi-trash'></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {isOpen && (
        <ModalCategory
          isEdit={!!currentItem}
          data={currentItem}
          isParent={currentItem ? !currentItem.parent : false}
          fetchData={fetchData}
          isOpen={isOpen}
          closeModal={() => setIsOpen(false)}
        />
      )}
      <AreYouSure
        isOpen={isOnDelete}
        onClose={() => setIsOnDelete(false)}
        onYes={deleteItem}
      />
    </main>
  )
}
