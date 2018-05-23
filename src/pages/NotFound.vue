<template lang="pug">
    .bg
        div 页面没找到,
            router-link(:to="{name: 'index'}", :replace="true") 返回首页
</template>

<script>

  export default {
    name: "NotFound",
    metaInfo: {
      titleTemplate: "%s-404"
    }
  };
</script>

<style lang="stylus" scoped>
    .bg
        position fixed
        top
        left 0
        right 0
        bottom 0
        color #303133
        background-color white
        width 100%
        height 100%
        display flex
        justify-content center
        align-items center

        span
            font-size 20px
</style>
