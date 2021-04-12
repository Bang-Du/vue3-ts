import { ActionTree, ActionContext } from 'vuex'
import { RootState } from '@/store'
import { PermissionState } from './state'
import { Mutations, PermissionMutationType } from './mutations'
import asyncRoutes from '@/router/asyncRoutes'
import { RouteRecordRaw } from 'vue-router'

export enum PermissionActionType {
  ACTION_SET_ROUTES = 'ACTION_SET_ROUTES'
}

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1],
  ): ReturnType<Mutations[K]>
} & Omit<ActionContext<PermissionState, RootState>, 'commit'>

const hasPermission = (roles: string[], route: RouteRecordRaw) => {
  if (route.meta && route.meta.roles) {
    return roles.some(role => {
      if (route.meta?.roles !== undefined) {
        return route.meta.roles.includes(role)
      }
    })
  } else {
    return true
  }
}

export const filterAsyncRoutes = (routes: RouteRecordRaw[], roles: string[]) => {
  const res: RouteRecordRaw[] = []
  routes.forEach(route => {
    const r = { ...route }
    if (hasPermission(roles, r)) {
      if (r.children) {
        r.children = filterAsyncRoutes(r.children, roles)
      }
      res.push(r)
    }
  })
  return res
}

export interface Actions {
  [PermissionActionType.ACTION_SET_ROUTES](
    { commit }: AugmentedActionContext
    , roles: string[]): void
}

export const actions: ActionTree<PermissionState, RootState> & Actions = {
  [PermissionActionType.ACTION_SET_ROUTES](
    { commit }: AugmentedActionContext
    , roles: string[]) {
    let accessedRoutes
    accessedRoutes = asyncRoutes
    // if (roles.includes('admin')) {
    //   accessedRoutes = asyncRoutes
    // } else {
    //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
    // }
    commit(PermissionMutationType.SET_ROUTES, accessedRoutes)
  }
}
