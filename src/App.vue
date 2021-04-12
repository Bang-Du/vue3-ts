<template>
  <!-- <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/test">Test</router-link>
  </div> -->
  <router-view/>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from './store'
import { resetRoutes } from "@/utils/routesUtils"
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();
    
    if (store.state.login.token) {
      resetRoutes(store, router);
    }

  },
})
</script>

<style lang="scss">

</style>
