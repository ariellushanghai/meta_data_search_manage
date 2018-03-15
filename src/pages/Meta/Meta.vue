<template>
    <router-view/>
</template>

<script>
  export default {
    name: 'Meta',
    metaInfo: {
      titleTemplate: '%s-元数据管理'
    },
    mounted() {
      console.log(`Meta.vue mounted()`);
    }
  }
</script>
