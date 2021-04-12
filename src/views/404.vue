<template>
  <div class="notFound">
    <el-button type='plain'>
      <router-link :to="{path: '/'}">Back to Index</router-link>
    </el-button>
    <!-- <img src="../assets/images/404.png" alt=""> -->
  </div>
</template>


<style lang="scss" scoped>
.notFound {
  width: 100vw;
  height: 100vh;
  background-image: url("../assets/images/404.png");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>