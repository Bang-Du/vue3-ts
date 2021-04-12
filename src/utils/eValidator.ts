import * as Utils from './curryingForm'

export const loginRules = {
  username: [{
    validator: Utils.formValidateGene('isValidateMobile', '请输入正确的手机号码'), trigger: ['blur', 'change']
  }],
  password: [{
    validator: Utils.formValidateGene('isValidatePassword', '请输入密码'), trigger: ['blur', 'change']
  }],
  captcha: [{
    validator: Utils.formValidateGene('isValidateName', '请输入图形验证码'), trigger: ['blur', 'change']
  }]
}