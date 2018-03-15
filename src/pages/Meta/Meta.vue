<template>
    <router-view/>
</template>

<script>
  // @flow
  export default {
    name: 'Meta',
    metaInfo: {
      titleTemplate: '%s-元数据管理'
    },
    data() {
      return {}
    },
    mounted() {
      console.log(`Meta.vue mounted()`);
    }
  }
</script>

<style lang="stylus" scoped>
</style>
