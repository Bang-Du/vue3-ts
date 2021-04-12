import { MutationTree } from 'vuex'
import { AppState } from './state'

// 定义mutation的名称
export enum AppMutationTypes {
  SET_USERINFO = 'SET_USERINFO',
  SET_ISCOLLAPSE = "SET_ISCOLLAPSE"
}

export type Mutations<S = AppState> = {
  [AppMutationTypes.SET_USERINFO](state: S, data: object): void
  [AppMutationTypes.SET_ISCOLLAPSE](state: S, flag: boolean): void

}

export const mutations: MutationTree<AppState> & Mutations = {
  [AppMutationTypes.SET_USERINFO](state: AppState, data: object) {
    state.userInfo = data
    if (data && Object.keys(data).length > 0) {
      sessionStorage.setItem("userInfo", JSON.stringify(data))
    } else {
      sessionStorage.removeItem("userInfo")
    }
  },
  [AppMutationTypes.SET_ISCOLLAPSE](state: AppState, flag: boolean) {
    state.isCollapse = flag
    sessionStorage.setItem("isCollapse", JSON.stringify(flag))
  },

}
