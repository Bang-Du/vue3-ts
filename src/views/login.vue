<template>
  <div class="login-container" v-loading='pageLoading'>
    <vHeader />
    <!-- <div class="login-top">
      <div class="login-title">
        <a href="javascript:;"><img src="../assets/images/logo.png" alt="logo"></a>
        <span class="text">虎蛙内部后台管理</span>
      </div>
    </div> -->
    <div class="login-main clearfix">
      <div class="login-bg"></div>
      <div class="login-box border_r3 clearfix">
        <div class="title">
          管理员登录
        </div>
        <el-form :model="loginForm" :rules='loginRules' ref="loginFormRef" class="login-ruleForm">
          <el-form-item prop="username">
            <el-input 
              placeholder="请输入手机号码"
              prefix-icon="el-icon-mobile"
              v-model="loginForm.username"
              ref='input1'
              maxlength='11'
              @input='mobileInput'
              @keyup.enter="handelTab(1, $event)"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input 
              placeholder="请输入密码"
              prefix-icon="iconfont iconicon-test"
              v-model="loginForm.password"
              ref='input2'
              type="password"
              @keyup.enter="handelTab(2, $event)"
            />
          </el-form-item>
          <el-form-item prop="captcha" class="login-check">
            <el-input 
              placeholder="请输入图片验证码"
              prefix-icon="iconfont iconyanzhengma1"
              ref='input3'
              v-model="loginForm.captcha"
              @keyup.enter="submitForm"
            />
            <img :src="checkPic" title="点击换一张" class="login-checkPic" @click="getCode">
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="footer">&nbsp;</div>
  </div>
</template>

<script lang='ts'>
import { 
  defineComponent,
  reactive, 
  toRefs,
  getCurrentInstance,
  ref,
  unref,
} from 'vue';
import LoginApi from "@/api/LoginApi"
import { loginRules } from "@/utils/eValidator"
import { ElForm } from 'element-plus'
import { useStore } from '@/store'
import { useRouter } from 'vue-router'
import { LoginMutationTypes } from "@/store/modules/login/mutations"
import { AppMutationTypes } from "@/store/modules/app/mutations"
import { PermissionActionType } from "@/store/modules/permission/action-types"
import vHeader from '../layout/components/header/index.vue'
import { RouteRecordRaw } from 'vue-router'


export default defineComponent({
  components: {
    vHeader,
  },
  setup() {
    const { ctx } = getCurrentInstance() as any;
    const store = useStore();
    const router = useRouter();

    // 表单组件
    const loginFormRef = ref(ElForm);
    const pageLoading = ref<boolean>(false);
    const onoff = ref<boolean>(true);
    const checkPic = ref<string>("");

    const loginForm = ref({
      username: "",
      password: "",
      captcha: "",
    });

    const getCode = () => {
      const random = Math.ceil(Math.random() * 10)
      checkPic.value = process.env.VUE_APP_API + '/bo/captcha?' + random
    };
    
    const submitForm = () => {
      const form = unref(loginFormRef);
      form.validate((valid: boolean) => {
        if (valid) {
          getLogin(loginForm.value)
        } else {
          console.log('表单提交错误')
          getCode()
          return false
        }
      })
    };

    const mobileInput = () => {
      let mobile = loginForm.value.username
      mobile = mobile.replace(/[\D]*/g, '')
      loginForm.value.username = mobile
    };

    const handelTab = (i: number, e: KeyboardEvent) => {
      if(ctx.$refs['input' + i]){
        ctx.$nextTick(() => {
          (e.target as HTMLInputElement).blur()
          let index = i + 1
          ctx.$refs['input' + index].focus()
        })
      }
    };

    

    const getLogin = async (form: object) => {
      LoginApi.login(form).then(res => {
        if (res && res.code == 0) {
          ctx.$message.success("登录成功")
          let data: any = res.data;
          // let data: any = res.data
          // pageLoading.value = true
          // 设置sessionInfo 权限列表
          // this.setSessionInfo(res.data.user.authorities.map(v => v.authority))
          // this.setMobile(res.data.user.mobile)
          store.commit(AppMutationTypes.SET_USERINFO, data.user);

          // this.$resetSetItem('SG_USER_TOKEN', JSON.stringify(res.data.token));

          // 设置 vuex-token
          store.commit(LoginMutationTypes.SET_TOKEN, data.token);

          store.dispatch(PermissionActionType.ACTION_SET_ROUTES, ['admin']);
          store.state.permission.dynamicRoutes.forEach((item: RouteRecordRaw) => {
            router.addRoute(item)
          });
          console.log(store.state.permission.dynamicRoutes)

          router.push({path: "/"});


          // 设置路由
          // this.routesSet()
          return
        }
        ctx.$message.error(res.msg)
        getCode()
      })
    };

    getCode();

    return {
      getCode,
      loginFormRef,
      loginForm,
      submitForm,
      pageLoading,
      onoff,
      checkPic,
      mobileInput,
      handelTab,
      getLogin,
      loginRules,
    };
  },
})
</script>

<style lang="scss">
@import "@/assets/css/login/index.scss";
</style>
