import BaseApi, { HttpResponse } from "./BaseApi"

export default class LoginApi extends BaseApi {
  static BASE_URL_LOGIN = '/bo'

  static login(params?: any): Promise<HttpResponse> {
    return this.buildApi(this.BASE_URL_LOGIN + '/login', params)
  }
  
  static captcha(params?: any): Promise<HttpResponse> {
    return this.buildApi(this.BASE_URL_LOGIN + '/captcha', params)
  }

  static logout(params?: any): Promise<HttpResponse> {
    return this.buildApi(this.BASE_URL_LOGIN + '/logout', params)
  }
  

}

