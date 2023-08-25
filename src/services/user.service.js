import { instance } from './axiosInstance'

const prefix = '/api/v1/user'

class UsersService {
  login(data) {
    return instance.post('/login', data)
  }
}

export const usersService = new UsersService()
