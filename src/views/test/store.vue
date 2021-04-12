<template>
  <div class="test_store">
    <h3>{{appId}}</h3>
    <h3>{{token}}</h3>

    <input type="text" v-model='language'> {{language}}
    <el-button type='primary' @click='changeLanguage'>改变language</el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, getCurrentInstance, onMounted } from 'vue'
import { useStore } from '@/store'
import { LoginMutationTypes } from "@/store/modules/login/mutations"
// import { AppActionTypes } from "@/store/modules/login/actions"
import { ElMessage } from "element-plus"
import Cookies from "js-cookie"

export default defineComponent({
  setup() {
    const { ctx } = getCurrentInstance() as any
    const { $message } = ctx
    const store = useStore()
    const appId = computed(() => store.state.login.appId)
    const token = computed(() => store.state.login.token)

    const language = ref('')
    const changeLanguage = () => {
      // store.dispatch(AppActionTypes.ACTION_SET_LANGUAGE, language.value)
      store.commit(LoginMutationTypes.SET_APPID, language.value)
      // store.commit(LoginMutationTypes.SET_TOKEN, language.value)
      // console.log(this)
      $message.success("ok")
    }

    onMounted(() => {
      console.log(Cookies.get("my_token"))
      console.log(sessionStorage.getItem("appId"))
    })

    return {
      appId,
      token,
      language,
      changeLanguage,
    }
  }
})
</script>
