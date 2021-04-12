/*
  生成基础axios对象，并对请求和响应做处理
  前后端约定接口返回结构规范
  {
    code: 0,
    data: '成功',
    msg: ''
  }
*/
import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios'
import router from '@/router'
import { useStore } from '@/store'
import { ElNotification } from 'element-plus';

const BASE_URL = process.env.VUE_APP_API

const http = axios.create({
  baseURL: BASE_URL,
  headers: {
    post: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    }
  },
  // 配置超时时间
  timeout: 10000,
  withCredentials: true
})

// 请求拦截
http.interceptors.request.use((config: AxiosRequestConfig) => {
  config.params = {
    ...config.params
  }
  return config
}, (err: AxiosError) => {
  return Promise.reject(err)
})

// 返回拦截
http.interceptors.response.use(
  (response: AxiosResponse) => {
    let responseURL = response.request.responseURL
    responseURL = responseURL.split(BASE_URL)[1]
    const res = response.data
    if (res.code === "0") {
      return res
    }
    
    if(response.config.responseType === 'blob' || response.config.responseType === 'arraybuffer'){  //下载excel类型
      let blob = new Blob([res], { type: 'application/vnd.ms-excel,charset=utf-8' });
      let downloadElement = document.createElement('a');
      let href = window.URL.createObjectURL(blob); //创建下载的链接
      downloadElement.href = href;
 
      //获取文件名 // Content-Disposition: attachment; filename=阿斯
      // let fileName = decodeURI(response.headers['content-disposition'].split("=")[1]);  //处理文件名乱码问题
      downloadElement.download = 'excel'; //下载后文件名
      document.body.appendChild(downloadElement);
      downloadElement.click(); //点击下载
      document.body.removeChild(downloadElement); //下载完成移除元素
      window.URL.revokeObjectURL(href); //释放掉blob对象
    }
    if (res.code === "-3") { // -3 是登录失败
      console.error("您未登录", responseURL)
      // useStore().dispatch("login/dispatchToken", null)

      router.replace({
        name: 'login',
      })
    } else {
      return res
    }
  }, 
  () => {
    ElNotification({ type: 'warning', message: '网络请求异常，请稍后再试！' })
  }
)

export default http
