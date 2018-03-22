import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
export function getUserById(id) {
  return fetch({
    baseURL: 'http://192.168.1.140:8093',
    url: '/user/getUserById',
    method: 'post',
    data: {
      id
    }
  })
}