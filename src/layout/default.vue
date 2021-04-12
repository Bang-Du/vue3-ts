<template>
  <div class="page-default-container">
    <el-container>
      <el-header height="56px">
        <v-header showLogout />
      </el-header>
      <el-container>
        <el-aside :class="{'width_64': isCollapse}">
          <v-nav  />
          <div class="isCollapse">
            <!-- <i v-if="!isCollapse" class="el-icon-s-fold" @click='$store.commit("setIsCollapse", true)'></i>
            <i v-else class="el-icon-s-unfold" @click='$store.commit("setIsCollapse", false)'></i> -->
          </div>
        </el-aside>
        <el-main>
          <router-view></router-view>
          <!-- <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive"></router-view> -->
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue"
import { useStore } from "@/store"
import vHeader from './components/header/index.vue'
import vNav from './components/nav/nav.vue'

export default defineComponent({
  components: {
    vNav,
    vHeader
  },
  setup() {
    const store = useStore();
    const isCollapse = computed(() => store.state.app.isCollapse);

    return {
      isCollapse
    }
  }
})
</script>

<style lang="scss">
@import "@/assets/css/mixin.scss";
@import "@/assets/css/public/layout.scss";
</style>
