<template lang="pug">
    #app
        el-container.container
            el-header.header
                global-header
            el-container#router_view
                router-view/
</template>

<script>

  import GlobalHeader from '@/components/GlobalHeader'

  export default {
    name: 'app',
    metaInfo: {
      title: '元数据搜索',
      titleTemplate: '%s-'
    },
    components: {
      GlobalHeader
    }
  }
</script>

<style lang="stylus" scoped>
    #app
        width 100%
        height 100%
        position fixed
        top 0
        bottom 0
        left 0
        right 0
        overflow hidden

    .header
        padding 0
        position absolute
        width 100%
        height 60px
        left 0
        right 0
        top 0

    .header /deep/ .el-menu--horizontal
        border-bottom none

    .container
        position absolute
        width 100%
        height 100%
        left 0
        right 0
        top 0
        bottom 0

    #router_view
        width 100%
        height calc(100% - 60px)
        position absolute
        left 0
        right 0
        top 60px
        bottom 0
</style>
