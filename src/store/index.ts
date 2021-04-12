import { createStore, createLogger } from 'vuex'
import { store as app, AppStore, AppState } from '@/store/modules/app'
import { store as login, LoginStore, LoginState } from '@/store/modules/login'
import { store as permission, PermissionStore, PermissionState } from '@/store/modules/permission'

export interface RootState {
  app: AppState
  login: LoginState
  permission: PermissionState
}

export type Store = AppStore<Pick<RootState, 'app'>>
                    & LoginStore<Pick<RootState, 'login'>>
                    & PermissionStore<Pick<RootState, 'permission'>>

const debug = process.env.NODE_ENV !== 'production'
const plugins = debug ? [createLogger({})] : []

export const store = createStore({
  plugins,
  modules: {
    app,
    login,
    permission,
  }
})

export function useStore(): Store {
  return store as Store
}
