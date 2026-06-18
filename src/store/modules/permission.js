import { asyncRoutes, constantRoutes } from '@/router'
import Layout from '@/layout/index.vue'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  // generateRoutes({ commit }, roles) {
  //   return new Promise(resolve => {
  //     let accessedRoutes
  //     if (roles.includes('admin')) {
  //       accessedRoutes = asyncRoutes || []
  //     } else {
  //       accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
  //     }
  //     commit('SET_ROUTES', accessedRoutes)
  //     resolve(accessedRoutes)
  //   })
  // },
  generateRoutes({ commit }, menus) {
    return new Promise(resolve => {
      const accessedRoutes = buildRoutes(menus)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

function buildRoutes(menus) {
  const map = new Map()
  const asyncRoutes = []
  menus.forEach(menu => {
    let path = menu.path
    if (menu.type === 'CATALOG' && !menu.path.startsWith('/')) {
      path = '/' + menu.path;
    }
    const route = {
      path: path,
      component: menu.type === 'CATALOG' ? Layout : loadView(menu.component),
      name: menu.title,
      meta: {
        title: menu.title
      }
    }
    if (menu.parentId) {
      const parent = map.get(menu.parentId)
      parent.children = parent.children || []
      parent.children.push(route)
    } else {
      asyncRoutes.push(route)
      map.set(menu.id, route)
    }
  })
  return asyncRoutes
}

export const loadView = (view) => {
  return (resolve) => require([`@/views/${view}`], resolve)
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
