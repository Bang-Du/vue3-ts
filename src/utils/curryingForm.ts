interface ValidatesInter {
  [key: string]: Function
}

const Validates: ValidatesInter = {
  isValidateMobile(str: string): boolean {
    if (!str) return false
    const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
    return reg.test(str)
  },

  isValidateName(str: string): boolean {
    if (!str) {
      return false
    }
    return true
  },

  isValidateChineseChat(str: string): boolean {
    if (!str) return false
    const reg = /^[\u4e00-\u9fa5]{1,4}$/
    return reg.test(str)
  },

  isValidateEmail(str: string): boolean {
    if (!str) return false
    const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    return reg.test(str)
  },

  // 判断是不是数字
  isNumber(str: string): boolean {
    if (!str) return false
    // 纯数字  || 小数
    if (/^[0-9]+$/.test(str) || /^[0-9]+\.?[0-9]+?$/.test(str)) {
      return true
    } else {
      return false
    }
  },

  isValidatePassword(str: string): boolean {
    if (!str) return false
    const reg = /^[a-zA-Z0-9]{6,}$/
    return reg.test(str)
  },

  isValidateArray(arr: []): boolean {
    if (arr.length === 0) return false
    return true
  },

  isValidateIdCard(str: string): boolean {
    if (!str) return false
    // 分别是 18位 和 15位 身份证的校验
    let reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    let reg1 = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$/
    return reg.test(str) || reg1.test(str)
  },
};

function _validates(key: string, value: string, msg: string, cb: Function) {
  if (Validates[key](value)) {
    cb()
  } else {
    cb(new Error(msg))
  }
}

export const formValidateGene = (key: string, msg: string, notRequired = false) => (rule: object, value: string, cb: Function) => {
  if (notRequired) {
    if (value) {
      _validates(key, value, msg, cb)
    } else {
      cb()
    }
    return
  }
  _validates(key, value, msg, cb)
}