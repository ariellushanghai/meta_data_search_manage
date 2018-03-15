<template lang="pug">
    el-container
        el-main.main
            .search-input
                h1 搜索您要找的元数据
                el-input#input_search(placeholder='请输入内容' v-model.trim='input_search' size='medium', :clearable='true', :disabled='isSearching')
                    el-button(slot='append' type='primary' icon='el-icon-search' size='medium', :loading='isSearching', @click='search')
                        | 搜索
            .tabbed-table
                el-tabs(v-model='activeTabName', @tab-click='handleTabClick' type='border-card')
                    el-tab-pane(label='Hive' name='hive') Hive
                    el-tab-pane(label='标签系统' name='labelsys') 标签系统
                    el-tab-pane(label='TimeLine' name='timeline') TimeLine
</template>

<script>
  // @flow
  import ElContainer from "element-ui/packages/container/src/main";
  import ElMain from "element-ui/packages/main/src/main";

  export default {
    components: {
      ElMain,
      ElContainer
    },
    name: 'MetaIndex',
    metaInfo: {
      titleTemplate: '%s-元数据管理'
    },
    data() {
      return {
        input_search: '',
        isSearching: false,
        activeTabName: 'hive'
      }
    },
    mounted() {
      console.log(`MetaIndex.vue mounted()`);
      document.querySelector('#input_search').focus();
    },
    methods: {
      search() {

      },
      handleTabClick(tab, event) {
        console.log(tab, event);
      }
    }
  }
</script>

<style lang="stylus" scoped>
    .search-input
        display flex
        flex-direction column
        width 100%
        height 100px

        h1
            color #303133
            font-size 18px
            line-height 30px
            height 30px
            margin 0 auto
            margin-bottom 5px
            text-align center

        .el-input
            width 50%
            max-width 400px
            margin 0 auto

            /deep/ .el-button--primary
                color #fff
                background-color #409EFF
                border 1px solid #409EFF
                border-top-left-radius 0
                border-bottom-left-radius 0

    .tabbed-table
        /*flex-grow 1*/
        height calc(100% - 100px)
        /deep/ .el-tabs
            height 100%
            max-height 100%
            overflow hidden

</style>
