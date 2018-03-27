<template lang="pug">
    el-container
        el-main.main
            .tabs-container
                el-tabs(v-model='active_tab_name', @tab-click='handleTabClick' type='border-card')
                    el-tab-pane(label='Hive' name='hive')
                        .search-result-container
                            search-result-table(:keyword="keyword", v-on:clickOnSearchResult='handleSelectSearchResult')
                        |
                        .result-details
                            transition(name="fade", mode="out-in", :appear="true")
                                component(v-bind:is='result_details_view', :table_id="table_id")


                    el-tab-pane(label='标签系统(暂无)' name='labelsys', :disabled="true") 标签系统
                    el-tab-pane(label='TimeLine(暂无)' name='timeline', :disabled="true") TimeLine
</template>

<script>
  // @flow
  import API from '@/service/api'
  import SearchResultTable from '@/components/SearchResultTable.vue'
  import DbTableTreeMenu from '@/components/DbTableTreeMenu.vue'
  import TableDetails from '@/components/TableDetails.vue'
  import ElContainer from "element-ui/packages/container/src/main";
  import ElMain from "element-ui/packages/main/src/main";
  import {map, assign} from 'lodash'
  import format from 'date-fns/format'

  const zh_cn = require('date-fns/locale/zh-CN');

  export default {
    components: {
      ElMain,
      ElContainer,
      SearchResultTable,
      DbTableTreeMenu,
      TableDetails
    },
    name: 'SearchResult',
    metaInfo: {
      titleTemplate: '%s-Hive搜索结果'
    },
    data() {
      return {
        active_tab_name: 'hive',
        result_details_view: '',
        table_id: 0
      }
    },
    computed: {
      keyword() {
        return this.$route.query.keyword;
      },
      type() {
        return this.$route.query.type;
      }
    },
    watch: {
      '$route'(to, from) {
        console.log(`$route changed: to : `, to, `from:`, from);
        if (to.query.keyword !== from.query.keyword) {
          return this.fetchIndexData();
        } else if (to.query.type !== from.query.type) {
          return this.fetchIndexData();
        } else {

        }
      }
    },
    // beforeRouteEnter(to, from, next) {
    //   console.log('SearchResult.vue beforeRouteEnter()');
    //   if (Number(to.params.db) === 0) {
    //     this.fetchHiveDBList()
    //   }
    //   return next();
    // },
    created() {
      if (this.keyword) {
        this.search();
      }
    },
    mounted() {
      console.log(`匹配${this.$route.query.keyword}搜索结果 mounted()`);
      this.current_db_id = this.$route.params;
    },
    methods: {
      search() {
        console.log(`search(${this.keyword})`);
      },
      handleTabClick(tab, event) {
        console.log(tab, event);
      },
      // 用户点击搜索结果
      handleSelectSearchResult(item) {
        console.log(`handleSelectSearchResult(): `, item);
        this.result_details_view = 'TableDetails';
        this.table_id = 7777777
        // return this.$emit('clickOnSearchResult', item);
      }
    }
  }
</script>

<style lang="stylus" scoped>
    .tabs-container
        /*flex-grow 1*/
        height 100%
        /deep/ .el-tabs__item
            user-select none

        /deep/ .el-tabs
            width 100%
            height 100%
            max-height 100%
            overflow hidden

        /deep/ .el-tabs__content
            height calc(100% - 40px)
            width 100%
            padding 0
            overflow hidden

        /deep/ .el-tab-pane
            display flex
            align-items stretch
            justify-content space-between
            width 100%
            height 100%
            overflow hidden

    .search-result-container
        flex-shrink 0
        flex-grow 0
        width 33%
        min-width 500px
        max-width 600px
        height 100%
        padding 0

    .result-details
        width 66%
        flex-grow 1
        padding 0
</style>
