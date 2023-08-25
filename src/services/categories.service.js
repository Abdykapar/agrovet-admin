import { instance } from './axiosInstance'

const prefix = '/api/v1/categories'

class CategoriesService {
  getAll() {
    return instance(prefix)
  }

  getParents() {
    return instance(`${prefix}/parent`)
  }

  getChild() {
    return instance(`${prefix}/sub`)
  }

  create(data) {
    return instance.post(`${prefix}`, data)
  }

  update(data, id) {
    return instance.put(`${prefix}/${id}`, data)
  }

  delete(id) {
    return instance.delete(`${prefix}/${id}`)
  }
}

export const categoriesService = new CategoriesService()
