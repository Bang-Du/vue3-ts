/*
 * @Description:
 * @Author: ZY
 * @Date: 2020-12-25 14:28:12
 * @LastEditors: ZY
 * @LastEditTime: 2020-12-25 15:03:37
 */
import { MutationTree } from 'vuex'
import { PermissionState } from './state'
import { RouteRecordRaw } from 'vue-router'
import { constantRoutes } from '@/router'

export enum PermissionMutationType{
  SET_ROUTES = 'SET_ROUTES'
}

export type Mutations<S = PermissionState> = {
  [PermissionMutationType.SET_ROUTES](state: S, routes: RouteRecordRaw[]): void
}

export const mutations: MutationTree<PermissionState> & Mutations = {
  [PermissionMutationType.SET_ROUTES](state: PermissionState, routes: RouteRecordRaw[]) {
    state.routes = constantRoutes.concat(routes)
    state.dynamicRoutes = routes
  }

}
