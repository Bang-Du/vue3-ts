<template>
  <div class="home">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>

<script lang="ts">
import HelloWorld from '@/components/HelloWorld.vue';
import { defineComponent, onMounted } from '@vue/runtime-core';
import { useRouter } from 'vue-router';

export default  defineComponent({
  components: {
    HelloWorld
  },
  setup() {
  }
})
</script>
