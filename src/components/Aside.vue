<template>
  <el-menu style="height: 100%" default-active="/Home"
           background-color="#545c64"
           text-color="#fff"
           active-text-color="#ffd04b"
           :collapse="isCollapse"
           :collapse-transition="false"
  >
    <el-menu-item index="/Home">
      <i class="el-icon-s-home"></i>
      <span slot="title">首页</span>
    </el-menu-item>

    <el-menu-item index="/One">
      <i class="el-icon-s-flag"></i>
      <span slot="title">导航一</span>
    </el-menu-item>

    <el-menu-item index="/Two">
      <i class="el-icon-s-opportunity"></i>
      <span slot="title">导航二</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Aside",
  data() {
    return {}
  },
  props: {
    isCollapse: Boolean
  }
}
</script>

<style scoped>

</style>
