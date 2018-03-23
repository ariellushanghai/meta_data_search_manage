<template lang="pug">
    el-container
        el-main.main
            .tabs-container
                el-tabs(v-model='activeTabName', @tab-click='handleTabClick' type='border-card')
                    el-tab-pane(label='Hive' name='hive')
                        .search-result-container
                            search-result-table(:keyword="keyword")

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
        current_db_id: '',
        input_search: '',
        isSearching: false,
        activeTabName: 'hive',
        pageNum: 1,
        pageSize: 10,
        table_data: [],
        selected_table_id: 0
      }
    },
    computed: {
      tableData() {
        return map(this.table_data, (row) => {
          return assign(row, {
            "createTime": format(
              new Date(row.createTime),
              'YYYY[年]MMMD[日]Ah[点]mm[分]',
              {locale: zh_cn}
            ),
            "modifyTime": format(
              new Date(row.modifyTime),
              'YYYY[年]MMMD[日]Ah[点]mm[分]',
              {locale: zh_cn}
            )
          })
        });
      },
      keyword() {
        return this.$route.query.keyword;
      }
    },
    watch: {
      '$route'(to, from) {
        console.log(`$route changed: to : `, to, `from:`, from);
        if (to.params.db !== from.params.db) {
          return this.fetchIndexData();
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
      console.log(`无匹配搜索结果 mounted() this.$route.params:`, this.$route.params);
      this.current_db_id = this.$route.params;
      this.fetchIndexData();
    },
    methods: {
      search() {
        console.log(`search(${this.keyword})`);
      },
      fetchHiveDBList() {
        return API.getHiveDBList({}).then(res => {
          console.log(`getHiveDBList res: `, res);
        }, err => {
          console.error(`err: `, err);
        });
      },
      fetchIndexData() {
        let loading = this.$loading({
          target: '.tabs-container',
          lock: true,
          text: '正在获取数据。。。',
          background: 'rgba(255,255,255,0.3)'
        });
        return API.getIndexData({
          pageNum: Number(this.pageNum),
          pageSize: Number(this.page_size)
        }).then(res => {
          console.log(`res: `, res);
          this.table_data = res.dbList;
          // this.page_total = Number(res.total);
          loading.close();
        }, err => {
          console.error(`err: `, err);
          loading.close();
          this.$notify({
            message: `${err.errmsg} : ${err.tipmsg}`,
            type: 'error',
            duration: 0
          });
          // window.onresize();
        });
      },
      handleSelectTable(table_id) {
        console.log(`handleSelectTable(${table_id})`);
        return this.selected_table_id = Number(table_id);
      },
      handleTabClick(tab, event) {
        console.log(tab, event);
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
            width 100%
            height 100%
            overflow hidden

    .search-result-container
        flex-shrink 0
        width 33%
        min-width 500px
        max-width 600px
        padding 5px

    .selected-table
        flex-grow 1
        padding 5px
</style>
