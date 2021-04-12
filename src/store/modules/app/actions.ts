import { ActionTree, ActionContext } from 'vuex'

// eslint-disable-next-line import/no-cycle
import { RootState } from '@/store'
import { AppState } from './state'
import { Mutations } from './mutations'
import { AppMutationTypes } from './mutations'

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1],
  ): ReturnType<Mutations[K]>
} & Omit<ActionContext<AppState, RootState>, 'commit'>

export enum AppActionTypes {
  
}
  
export interface Actions {
  
}

export const actions: ActionTree<AppState, RootState> & Actions = {
  
}
