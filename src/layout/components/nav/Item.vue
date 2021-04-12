<template>
  <i class="iconfont" v-if='icon' :class="icon"></i>
  <span v-if='title'>{{title}}</span>
</template>

<script>
import { defineComponent } from "vue"
export default defineComponent({
  name: 'MenuItem',
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  }
})
</script>

