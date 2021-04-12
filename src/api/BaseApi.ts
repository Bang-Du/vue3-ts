import http from './axios'
import qs from 'qs'
// import { getType } from "@/utils/toolsUtil"
import { useStore } from "@/store"

// const preUrl = process.env.VUE_APP_PREURL

export interface HttpResponse {
  code: number;
  msg: string;
  data: object | string;
}

export default class BaseApi {
  static http = http

  static preUrl = process.env.VUE_APP_PREURL

  static buildApi(url: string, args?: any, configOptions?: object): Promise<HttpResponse> {
    let config = {
      headers: {
        post: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'SG_USER_TOKEN': useStore().state.login.token,
          'sgAppId': useStore().state.login.appId
        }
      },
      ...configOptions
    }
    const _args = qs.stringify(args)
    return this.http.post(url, _args, config)
  }

  static jsonApi (url: string, args?: any, configOptions?: object) {
    const config = {
      headers: {
        post: {
          'Content-Type': 'application/json; charset=UTF-8',
          'SG_USER_TOKEN': useStore().state.login.token,
          'sgAppId': useStore().state.login.appId
        }
      },
      ...configOptions
    }
    return this.http.post(url, args, config)
  }
  
  static fileApi (url: string, args?: any, configOptions?: object) {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'SG_USER_TOKEN': useStore().state.login.token,
        'sgAppId': useStore().state.login.appId
      },
      ...configOptions
    }
    return http.post(url, args, config)
  }
  
  static donwloadApi (url: string, args?: any, configOptions?: object) {
    const config: any = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'SG_USER_TOKEN': useStore().state.login.token,
        'sgAppId': useStore().state.login.appId
      },
      responseType: "blob",
      timeout: 60 * 1000,
      ...configOptions
    }
    const _args = qs.stringify(args)
    return http.post(url, _args, config)
  }
  
  static donwloadByJsonApi (url: string, args?: any, configOptions?: object) {
    const config: any = {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'SG_USER_TOKEN': useStore().state.login.token,
        'sgAppId': useStore().state.login.appId
      },
      responseType: "blob",
      timeout: 60 * 1000,
      ...configOptions
    }
    return http.post(url, args, config)
  }
}