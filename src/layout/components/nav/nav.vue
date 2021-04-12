<template>
  <div class="v-nav-container">
    <el-menu :default-active="currentRoute.path" 
              router 
              unique-opened 
              class="nav-menu" 
              :collapse="isCollapse"
              background-color="#2C3C53" 
              text-color="#B2B3C5"
              active-text-color="#fff" >
      <sidebar-item v-for="(route) in routes" :key="route.meta?.title" :route="route" :base-path='route.path' />
    </el-menu>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue"
import { useRoute } from 'vue-router'
import { deepClone } from '@/utils/toolsUtil.ts'
import { useStore } from "@/store"
import SidebarItem from './navItem_1.vue'

export default defineComponent({
  components: {
    SidebarItem,
  },
  setup() {
    const store = useStore();
    const currentRoute = useRoute();

    // const routes = computed(() => filterRoutesWithoutHidden(addRouters[0]?.children));
    const isCollapse = computed(() => store.state.app.isCollapse);
    // const addRouters = computed(() => store.state.permission.addRouters);
    const routes = computed(() => store.state.permission.dynamicRoutes[0].children);

    console.log(routes.value)
    
    const findZIndex = (routes, i = 1, r = {}) => {
      for (let key in routes) {
        let item = routes[key]
        r[i] = ++r[i] || 1
        if (item.children && item.children.length > 0) {
          this.findZIndex(item.children, i + 1, r)
        }
      }
      return r
    };
    const filterRoutesWithoutHidden = (routes, res = []) => {
      for (let key in routes) {
        let item = routes[key]
        if (item.hidden) continue;
        let obj = {
          ...deepClone(item),
          children: []
        }
        obj.meta.authority = obj.meta.authority || []
        res.push(obj)
        if (item.children && item.children.length > 0) {
          this.filterRoutesWithoutHidden(item.children, obj.children)
          obj.meta.authority = obj.meta.authority.concat(...obj.children.map(v => v.meta.authority))
          obj.meta.authority = Array.from(new Set(obj.meta.authority))
          if (obj.children.length === 0) {
            delete obj.children
          }
        } else {
          delete obj.children
        }
      }
      return res
    };

    const maxIndex = Object.keys(findZIndex(routes)).sort((a, b) => a - b).slice(-1)[0];
    let aside = document.querySelector(".el-aside");
    if (aside) {
      aside.classList.add(`width_${160 + (maxIndex - 2) * 20}`);
    }

    console.log(currentRoute.path)

    return {
      findZIndex,
      filterRoutesWithoutHidden,
      routes,
      isCollapse,
      // addRouters,
      currentRoute,
    }
  },
});
</script>

<style lang="scss">
@import "@/assets/css/mixin.scss";
@import "@/assets/css/public/nav.scss";
</style>
