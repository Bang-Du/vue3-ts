// import { getSidebarStatus, getSize } from '@/utils/cookies'
// import { getLocale } from '@/locales'

// export enum DeviceType {
//   Mobile,
//   Desktop,
// }

export interface AppState {
  userInfo: object;
  isCollapse: boolean;
}

export const state: AppState = {
  userInfo: JSON.parse(sessionStorage.getItem("userInfo") || "{}"),
  isCollapse: JSON.parse(sessionStorage.getItem("isCollapse") || "false"),
}