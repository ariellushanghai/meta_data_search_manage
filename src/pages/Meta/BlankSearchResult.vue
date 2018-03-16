<template lang="pug">
    el-container
        el-main.main
            .tabbed-table
                el-tabs(v-model='activeTabName', @tab-click='handleTabClick' type='border-card')
                    el-tab-pane(label='Hive' name='hive')
                        el-table(:data="tableData", size="small", :fit="true", :stripe="true")
                            el-table-column(prop='id', label="ID", min-width="50")
                            el-table-column(prop='name', label="库名", min-width="100")
                            el-table-column(prop='descr', label="描述", min-width="100")
                            el-table-column(prop='tableCnt', label="表数量", min-width="50")
                            el-table-column(prop='dbAdmin', label="Hive库管理员", min-width="100")
                            el-table-column(prop='sasPermissionAdmin', label="sas权限管理员", min-width="100")
                            el-table-column(prop='creator', label="创建人", min-width="100")
                            el-table-column(prop='createTime', label="建库时间", min-width="150")
                            el-table-column(prop='modifier', label="修改人", min-width="100")
                            el-table-column(prop='modifyTime', label="更新时间", min-width="150")
                    el-tab-pane(label='标签系统(暂无)' name='labelsys', :disabled="true") 标签系统
                    el-tab-pane(label='TimeLine(暂无)' name='timeline', :disabled="true") TimeLine
</template>

<script>
  // @flow
  import API from '@/service/api'
  import ElContainer from "element-ui/packages/container/src/main";
  import ElMain from "element-ui/packages/main/src/main";
  import {map, assign} from 'lodash'
  import format from 'date-fns/format'

  const zh_cn = require('date-fns/locale/zh-CN');

  export default {
    components: {
      ElMain,
      ElContainer
    },
    name: 'BlankSearchResult',
    metaInfo: {
      titleTemplate: '%s-无匹配搜索结果'
    },
    data() {
      return {
        current_db_id: '',
        input_search: '',
        isSearching: false,
        activeTabName: 'hive',
        page: 1,
        pageSize: 10,
        table_data: []
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
    mounted() {
      console.log(`无匹配搜索结果 mounted() this.$route.params:`, this.$route.params);
      this.current_db_id = this.$route.params;
      this.fetchIndexData();
    },
    methods: {
      search() {

      },
      fetchIndexData() {
        let loading = this.$loading({
          target: '.tabbed-table',
          lock: true,
          text: '正在获取数据。。。',
          background: 'rgba(255,255,255,0.3)'
        });
        return API.getIndexData({
          page: Number(this.page),
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
        height 100%
        /deep/ .el-tabs
            height 100%
            max-height 100%
            overflow hidden

</style>
