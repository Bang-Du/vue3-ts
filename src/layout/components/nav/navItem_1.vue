<template>
  <div>
    <template v-if="!route.children || route.alwaysShow">
      <el-menu-item :index="resolvePath(route.path)" class="nav-menu-index">
        <item :icon="route.meta.icon||(route.meta && route.meta.icon)" :title="route.meta.title"  />
      </el-menu-item>
    </template>
    <el-submenu v-else :index="returnIndex(route)" class="nav-submenu">
      <template #title>
        <item v-if="route.meta" :icon="route.meta && route.meta.icon" :title="route.meta.title"  />
      </template>
      <sidebar-item
        v-for="child in route.children"
        :key="child.path || child.meta.title"
        :route="child"
        :base-path="resolvePath(route.path)"
      />
    </el-submenu>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import path from 'path'
import Item from './Item.vue'

export default defineComponent({
  name: 'SidebarItem',
  components: { Item },
  props: {
    route: { type: Object, required: true, default: () => ({}) },
    basePath: { type: String, default: '' }
  },
  setup(props) {
    const con = (...args: any) => {
      console.log(args)
    }
    const resolvePath = (routePath: string): string => {
      return path.resolve(props.basePath, routePath)
    };

    const returnIndex = (route: any) => {
      let index = resolvePath(route.path)
      if (['', '/'].includes(index)) {
        return route.meta?.title
      }
      return index
    };


    return {
      con,
      resolvePath,
      returnIndex,
    }
  }
})
</script>

<style lang="scss">
@import "@/assets/css/mixin.scss";
.v-nav-container {
  flex: 1;
  line-height: 50px;
  overflow-x: hidden;
  overflow-y: auto;
  .nav-menu {
    text-align: left;
    border-right: 0 !important;
    .iconfont{
			margin-right: 10px;
			font-size: 22px;
      color: $--color-primary !important;
      // @include text_color("color-primary");
      margin-left: 0;
      transition: margin 1s linear 300ms;
    }
    > div > .el-menu-item,
    > div > .el-submenu > .el-submenu__title {
      padding-left: 14px !important;
    }
    &.el-menu--collapse {
      > div .nav-submenu > .el-submenu__title {
        span, .el-submenu__icon-arrow {
          display: none;
        }
        .iconfont {
          margin-left: 6px;
        }
      }
      // .is-active .iconfont {
      //   color: #fff !important;
      // }
    }
  }
  // :not(.el-menu--collapse)
  /*
    start: 先设置全部的 span 都是白色,然后吧 el-menu 里的 span 变为 灰色
  */
  .el-menu-item {
    span{
      color: #fff;
    }
  }
  .el-submenu__title{
    background-color: #2C3C53 !important;
    &:hover{ background-color: #213447 !important;}
    .el-submenu__icon-arrow{
      right: 12px;
    }
    .iconfont{
      color: $--color-primary !important;
      // @include text_color("color-primary");
    }
    span {
      color: #fff;
    }
  }
  .el-submenu__title ~ .el-menu .el-submenu__title,
  .el-submenu__title ~ .el-menu .el-menu-item {
    span {
      color: #B2B3C5 !important;
    }
    background-color: #253447 !important;
  }
  // END--------

  /* 
    start: 导航 active 和 hover 状态
  */
  .el-menu-item.nav-menu-index.is-active {
    // @include bg_color("color-primary");
    background-color: $--color-primary !important;
    .iconfont, span { color: #fff !important; }
  }
  .nav-submenu {
    .el-menu-item {
      &:hover{
        background-color: #F6FBFF !important;
        span {
          color: $--color-primary !important;
          // @include text_color("color-primary");
        }
      }
      // 加多一个 .nav-menu-index 是为了增加权重
      &.nav-menu-index.is-active{
        background-color: $--color-primary !important;
        // @include bg_color("color-primary");
        span {
          color: #fff !important;
        }
        &:hover{color: #fff !important;}
      }
    }
  }
  // END--------
}
</style>