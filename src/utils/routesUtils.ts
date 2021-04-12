import { RouteRecordRaw } from "vue-router";
import { resetRouter } from "@/router"
import { PermissionActionType } from "@/store/modules/permission/action-types"

// 刷新时，重置路由
export function resetRoutes(store: any, router: any) {
  // 获取刷新
  let path = window.location.href.split("#")[1]
  store.dispatch(PermissionActionType.ACTION_SET_ROUTES, ['admin'])
  resetRouter()
  store.state.permission.dynamicRoutes.forEach((item: RouteRecordRaw) => {
    router.addRoute(item)
  })
  router.push({path: path});
}