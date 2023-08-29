import React, { useEffect, useState } from 'react'
import { productsService } from '../services/products.service'
import AreYouSure from '../components/common/AreYouSure'
import ModalProduct from '../components/modals/ModalProduct'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const [products, setProducts] = useState([])
  const [currentItem, setCurrentItem] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isOnDelete, setIsOnDelete] = useState(false)

  const navigate = useNavigate()

  const fetchData = () => {
    productsService
      .getProducts()
      .then(({ data }) => {
        setProducts(data)
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    fetchData()
  }, [])

  const onEdit = (item) => {
    navigate(`/product/create?id=${item._id}`)
  }

  const onCreate = () => {
    setCurrentItem(null)
    setIsOpen(true)
  }

  const onDelete = (item) => {
    // setCurrentItem(item)
    // setIsOnDelete(true)
    deleteItem(item)
  }

  const deleteItem = (item) => {
    productsService
      .delete(item._id)
      .then(() => {
        setIsOnDelete(false)
        setCurrentItem(null)
        fetchData()
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
                <h5 className='card-title'>Товары</h5>
                <button
                  className='btn btn-primary'
                  onClick={() => navigate('/product/create')}
                >
                  <i className='bi bi-plus-lg mr-10'></i>
                  <span className='inline-block'>Добавить товар</span>
                </button>
              </div>

              <table className='table'>
                <thead>
                  <tr>
                    <th scope='col'>#</th>
                    <th scope='col'>Название</th>
                    <th scope='col'>Категория</th>
                    <th scope='col'>Фото</th>
                    <th scope='col'></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((i, ind) => (
                    <tr key={i._id}>
                      <th scope='row'>{ind + 1}</th>
                      <td>{i.title}</td>
                      <td>{i.category?.title}</td>
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
                          <i class='bi bi-pencil-square'></i>
                        </button>
                        <button
                          className='btn btn-default'
                          onClick={() => onDelete(i)}
                        >
                          <i class='bi bi-trash'></i>
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
    </main>
  )
}
