import Cookies from 'js-cookie'

export interface LoginState {
  appId: string | null,
  token: string
}

export const state: LoginState = {
  appId: sessionStorage.getItem("appId"),
  token: Cookies.get("my_token"),
}