import request from '@/utils/request'
import qs from 'qs'

export function create(data) {
  return request({
    url: '/sys/menu',
    method: 'post',
    data
  })
}

export function _delete(ids) {
  return request({
    url: '/sys/menu',
    method: 'delete',
    data: ids
  })
}

export function update() {
  return request({
    url: '/sys/menu',
    method: 'put'
  })
}

export function query(params) {
  return request({
    url: '/sys/menu',
    method: 'get',
    params,
    paramsSerializer: params => qs.stringify(params, { indices: false })
  })
}


export default {create, _delete, update, query}
