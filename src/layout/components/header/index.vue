<template>
  <el-row class="header-container" :class="{'noBg': !showLogout}">
    <el-col :span="12" class="company-container">
      <slot name='company'>
        <a href="javascript:;" class="logo"><img src="../../../assets/images/logo.png" alt="logo"></a>
        <span class="title">虎蛙内部后台管理</span>
      </slot>
      <!-- <a href="javascript:;" class="logo"><img :src="companyInfo.companyLogo" alt=""></a>
      <div class="title">{{companyInfo.companyName}}后台管理</div> -->
    </el-col>
    <el-col :span="12" class="login-container" v-if='showLogout'>
      <span class="name">{{userInfo.mobile}}</span>
      <a href="javascript:;" @click="logout"><i class="iconfont icontuichudenglu"></i></a>
    </el-col>
  </el-row>
</template>

<script>
import LoginApi from '@/api/LoginApi';
import { useStore } from 'vuex'
import { computed, defineComponent, getCurrentInstance } from 'vue'
import { LoginMutationTypes } from "@/store/modules/login/mutations"
import { AppMutationTypes } from "@/store/modules/app/mutations"
import { useRouter } from 'vue-router';

export default defineComponent({
  props: {
    showLogout: {
      type: Boolean,
      default: false,
    }
  },
  setup() {
    const { ctx } = getCurrentInstance();
    const store = useStore();
    const router = useRouter();

    const userInfo = computed(() => store.state.app.userInfo);

    
    const logout = () => {
      ctx.$confirm('是否退出该账号?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'none',
      }).then(() => {
        handleLogout()
      })
    };
    const handleLogout = () => {
      LoginApi.logout().then(res => {
        if (res && res.code == 0) {
          // this.logout_permission();
          ctx.$message.success('退出成功！');
          router.replace({ path: '/login' });
          store.commit(LoginMutationTypes.SET_TOKEN, null);
          store.commit(AppMutationTypes.SET_USERINFO, null);
        }
      })
    }

    return {
      userInfo,
      logout,
      handleLogout,
    }
  },
  // computed: {
  //   ...mapGetters(['mobile', 'myRoleInfo', 'companyInfo'])
  // },
  // methods: {
  //   ...mapActions("login", ['dispatchToken']),
  //   ...mapActions('permission', {
  //     "logout_permission": 'logout'
  //   }),
    
  // }
})
</script>

<style lang="scss">
@import "@/assets/css/mixin.scss";
@import "@/assets/css/public/header.scss";
</style>
