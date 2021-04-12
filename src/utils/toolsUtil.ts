import { useStore } from '@/store'

// 深拷贝
export function deepClone(source: any): any {
  let res: any;
  if (typeof source === 'object') {
    switch (Object.prototype.toString.call(source).slice(8, -1)) {
      case "Array":
        res = []
        for (let val of source) {
          res.push(deepClone(val))
        }
        break;
      case 'Null':
        res = null;
        break;
      case "Date":
      case "Regexp":
        res = source;
        break;
      default:
        res = {}
        for (let k in source) {
          res[k] = deepClone(source[k])
        }
    }
  } else {
    res = source
  }
  return res
}


/* 获取参数的数据类型，输出的是小写的数据类型 */
export function getType(source: any) {
  return Object.prototype.toString.call(source).slice(8, -1).toLowerCase()
}


/* 获取地址栏参数 */
export function getAddressURLParam(paramName: string){
  //构造一个含有目标参数的正则表达式的对象
  var reg = new RegExp("(^|&)" + paramName + "=([^&]*)(&|$)");
  //匹配目标参数
  var url = window.location.search.substr(1).match(reg);
  //返回参数值
  if(url != null) return unescape(url[2]);
  return null;
}
