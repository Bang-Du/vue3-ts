import { MutationTree } from 'vuex'
import { LoginState } from './state'
import Cookies from 'js-cookie'

// 定义mutation的名称
export enum LoginMutationTypes {
  SET_APPID = 'SET_APPID',
  SET_TOKEN = 'SET_TOKEN',
}

export type Mutations<S = LoginState> = {
  [LoginMutationTypes.SET_APPID](state: S, appId: string): void
  [LoginMutationTypes.SET_TOKEN](state: S, token: string): void

}

export const mutations: MutationTree<LoginState> & Mutations = {
  [LoginMutationTypes.SET_APPID](state: LoginState, appId: string) {
    state.appId = appId
    if (appId) {
      sessionStorage.setItem("appId", appId)
    } else {
      sessionStorage.removeItem("appId")
    }
  },

  [LoginMutationTypes.SET_TOKEN](state: LoginState, token: string) {
    state.token = token
    if (token) {
      Cookies.set("my_token", token, { expires: 0.3 })
    } else {
      Cookies.remove("my_token")
    }
  },

}
