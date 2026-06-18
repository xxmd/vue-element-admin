import request from '@/utils/request'

export function findByName(name) {
  return request({
    url: `/sys/enum/findByName/${name}`,
    method: 'get'
  })
}


export default {findByName}
