<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {},
  data() {
    return {
      user: JSON.parse(sessionStorage.getItem('CurUser'))
    }
  },
  watch: {
    '$store.state.menu': { //监视 store中的menu改变 重新serMenu添加路由数据，解决页面刷新 路由丢失问题
      handler(val, old) {
        if (!old && this.user && this.user.no) {
          this.$store.commit("setRouter", val)
        }
      },
      immediate: true
    }
  }
}
</script>

<style>
#app {
  height: 100%;
}
</style>
