<template lang="pug">
    el-container
        el-main.main
            .search-input
                h1 搜索您要找的元数据
                el-input#input_search(placeholder='请输入内容', v-model.trim='input_search', @keyup.enter.native="search", size='medium', :clearable='true', :disabled='isSearching')
                    el-button(slot='append' type='primary' icon='el-icon-search' size='medium', :loading='isSearching', @click='search')
                        | 搜索
            .tabbed-table
                el-tabs(v-model='activeTabName', @tab-click='handleTabClick' type='border-card')
                    el-tab-pane(label='Hive' name='hive')
                        el-table(:data="tableData", size="small", height="100%", :fit="true", :stripe="true")
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

            .pagination
                el-pagination(@size-change="handlePageSizeChange", @current-change="handleCurrentPageChange", :current-page="pageNum", :total="total", :page-size="10", :page-sizes="[10, 20, 50, 100]", layout="total, sizes, prev, pager, next, jumper", :background="true", :small="true")

</template>

<script>
  // @flow
  import API from "@/service/api";
  import ElContainer from "element-ui/packages/container/src/main";
  import ElMain from "element-ui/packages/main/src/main";
  import { isEmpty, map, assign } from "lodash";
  import format from "date-fns/format";

  const zh_cn = require("date-fns/locale/zh-CN");

  export default {
    components: {
      ElMain,
      ElContainer
    },
    name: "MetaIndex",
    metaInfo: {
      titleTemplate: "%s-元数据管理"
    },
    data() {
      return {
        input_search: "",
        isSearching: false,
        activeTabName: "hive",
        pageNum: 1,
        total: 10, // 表格总条目数
        table_data: [],
        hive_db: {}
      };
    },
    computed: {
      tableData() {
        return map(this.table_data, (row) => {
          return assign(row, {
            "createTime": format(
              new Date(row.createTime),
              "YYYY[年]MMMD[日]Ah[点]mm[分]",
              { locale: zh_cn }
            ),
            "modifyTime": format(
              new Date(row.modifyTime),
              "YYYY[年]MMMD[日]Ah[点]mm[分]",
              { locale: zh_cn }
            )
          });
        });
      }
    },
    mounted() {
      console.log(`MetaIndex.vue mounted()`);
      document.querySelector("#input_search").focus();
      this.fetchIndexData();
      // 后台获取Hive DB列表，当空白搜索时直接跳去首条DB
      this.fetchHiveDBList().then(res => {
        // console.log(`getHiveList res: `, res);
        this.hive_db = res;
      }, err => {
        console.error(`err: `, err);
      });
    },
    methods: {
      search() {
        if (this.input_search === "") {
          if (isEmpty(this.hive_db)) {
            return this.fetchHiveDBList().then(res => {
              console.log(`getHiveList res: `, res);
              this.hive_db = res;
              return this.$router.push({ name: "blanksearchresult", params: { db: this.hive_db.dbList[0].id } });
            }, err => {
              console.error(`err: `, err);
            });
          } else {
            return this.$router.push({ name: "blanksearchresult", params: { db: this.hive_db.dbList[0].id } });
          }
        } else {
          return this.$router.push({
            name: "searchresult",
            query: {
              keyword: this.input_search,
              type: "all"
            }
          });
        }
      },
      fetchIndexData() {
        let loading = this.$loading({
          target: ".tabbed-table",
          lock: true,
          text: "正在获取数据。。。",
          background: "rgba(255,255,255,0.3)"
        });
        return API.getIndexData({
          pageNum: Number(this.pageNum),
          total: Number(this.page_size)
        }).then(res => {
          // console.log(`res: `, res);
          this.table_data = res.dbList.list;
          // this.total = Number(res.total);
          loading.close();
        }, err => {
          console.error(`err: `, err);
          loading.close();
          this.$notify({
            message: `${err.errmsg}`,
            type: "error",
            duration: 0
          });
        });
      },
      // 获取Hive DB列表
      fetchHiveDBList() {
        return API.getHiveList({});
      },
      handleTabClick(tab, event) {
        console.log(tab, event);
      },
      handleCurrentPageChange(val) {
        console.log(`当前页: ${val}`);
        // this.pageNum = Number(val);
        // return this.fetchData();
      },
      handlePageSizeChange(val) {
        console.log(`每页 ${val} 条`);
        // this.page_size = Number(val);
        // return this.fetchData();
      }
    }
  };
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
        height calc(100% - 150px)

        /deep/ .el-tabs
            height 100%
            overflow hidden

        /deep/ .el-tabs__content
            width 100%
            height calc(100% - 40px)
            padding 0
            overflow hidden

        /deep/ .el-tab-pane
            overflow hidden
            height 100%

        /deep/ .el-table
            height 100%
            overflow-y auto
            scroll-behavior smooth

    .pagination
        display flex
        justify-content center
        flex none
        height 50px

    .pagination /deep/ .el-pagination
        display flex
        justify-content center
        align-items center
        padding 5px
        padding-bottom 0

</style>
