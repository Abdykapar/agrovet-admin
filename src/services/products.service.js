import { instance } from './axiosInstance'

const prefix = '/api/v1/products'

class ProductsService {
  getProducts() {
    return instance(prefix)
  }

  create(data) {
    return instance.post(prefix, data)
  }

  update(data, id) {
    return instance.put(`${prefix}/${id}`, data)
  }

  delete(id) {
    return instance.delete(`${prefix}/${id}`)
  }
}

export const productsService = new ProductsService()
