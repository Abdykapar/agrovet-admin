import React, { useState } from 'react'
import { usersService } from '../services/user.service'
import { useDispatch } from 'react-redux'
import { setToken, setUser as setUserToStore } from '../redux/authReducer'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [user, setUser] = useState({})
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onLogin = (e) => {
    e.preventDefault()
    usersService
      .login(user)
      .then(({ data }) => {
        dispatch(setToken(data.token))
        dispatch(setUserToStore(data.user))
        navigate('/')
      })
      .catch((err) => console.log(err))
  }

  return (
    <main>
      <div className='container'>
        <section className='section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4'>
          <div className='container'>
            <div className='row justify-content-center'>
              <div className='col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center'>
                <div className='card mb-3'>
                  <div className='card-body'>
                    <div className='pt-4 pb-2'>
                      <h5 className='card-title text-center pb-0 fs-4'>
                        Agrovetasia
                      </h5>
                    </div>

                    <form
                      onSubmit={onLogin}
                      className='row g-3 needs-validation'
                    >
                      <div className='col-12'>
                        <label for='yourUsername' className='form-label'>
                          Имя пользователя
                        </label>
                        <div className='input-group has-validation'>
                          <input
                            value={user.username}
                            onChange={({ target }) =>
                              setUser({ ...user, username: target.value })
                            }
                            type='text'
                            name='username'
                            className='form-control'
                            id='yourUsername'
                            required
                          />
                          <div className='invalid-feedback'>
                            Please enter your username.
                          </div>
                        </div>
                      </div>

                      <div className='col-12'>
                        <label for='yourPassword' className='form-label'>
                          Пароль
                        </label>
                        <input
                          value={user.password}
                          onChange={({ target }) =>
                            setUser({ ...user, password: target.value })
                          }
                          type='password'
                          name='password'
                          className='form-control'
                          id='yourPassword'
                          required
                        />
                        <div className='invalid-feedback'>
                          Please enter your password!
                        </div>
                      </div>
                      <div className='col-12'>
                        <button className='btn btn-primary w-100' type='submit'>
                          Войти
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
