import { ActionTree, ActionContext } from 'vuex'

// eslint-disable-next-line import/no-cycle
import { RootState } from '@/store'
import { LoginState } from './state'
import { Mutations } from './mutations'

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1],
  ): ReturnType<Mutations[K]>
} & Omit<ActionContext<LoginState, RootState>, 'commit'>

export enum LoginActionTypes {
  
}
  
export interface Actions {
  
}

export const actions: ActionTree<LoginState, RootState> & Actions = {
  
}
