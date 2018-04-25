<template lang="pug">
    el-container
        el-main.main
            .search-input
                h1 搜索您要找的元数据
                el-input#input_search(placeholder='请输入内容', v-model.trim='input_search', @keyup.enter.native="search", size='large', :clearable='true', :disabled='isSearching')
                    el-button(slot='append' type='primary' icon='el-icon-search' size='large', :loading='isSearching', @click='search')
                        | 搜索
            .tabbed-table
                el-tabs(v-model='activeTabName', @tab-click='handleTabClick' type='border-card')
                    el-tab-pane(label='Hive' name='hive')
                        el-table(:data="tableData", @row-click="handleRowClick", size="small", height="100%", :fit="true", :stripe="true")
                            //- el-table-column(prop='id', label="ID", min-width="200")
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
                .text-total(v-if='hive_db.DBTOTAL || hive_db.TABLETOTAL')
                    span 共
                    span.num {{hive_db.DBTOTAL}}
                    span 个库，共
                    span.num {{hive_db.TABLETOTAL}}
                    span 张表
                |
                el-pagination(@size-change="handlePageSizeChange", @current-change="handleCurrentPageChange", :current-page.sync="pageNum", :total="total", :page-size="pageSize", :page-sizes="[10, 20, 50, 100]", layout="jumper, prev, pager, next, sizes", :background="true", :small="true")

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
        input_search: "",// 用户输入搜索词
        isSearching: false, // Flag位： 正在搜索
        activeTabName: "hive",// 当前选中tab页，<el-tabs/>需要
        pageNum: 1,// 当前页
        pageSize: 10,// 请求分页数
        total: 0,// Hive库总数
        table_data: [],// Hive库列表
        hive_db: {} // 接口返回的Hive库信息
      };
    },
    computed: {
      tableData() {
        return map(this.table_data, (row) => {
          return assign(row, {
            "createTime": row.createTime ? format(
              new Date(row.createTime),
              "YYYY[年]MMMD[日]Ah[点]mm[分]",
              { locale: zh_cn }
            ) : "无",
            "modifyTime": row.modifyTime ? format(
              new Date(row.modifyTime),
              "YYYY[年]MMMD[日]Ah[点]mm[分]",
              { locale: zh_cn }
            ) : "无"
          });
        });
      }
    },
    mounted() {
      console.log(`MetaIndex.vue mounted()`);
      document.querySelector("#input_search").focus();
      this.$store.commit("SAVE_USER_INPUT_SEARCH", {
        seach_word: ""
      });
      this.fetchIndexData();
      // 后台获取Hive DB列表，当空白搜索时直接跳去首条DB
      this.fetchHiveDBList().then(res => {
        this.hive_db = res;
      }, err => {
        console.error(`后台获取Hive DB列表失败: `, err.errmsg);
      });
    },
    methods: {
      search() {
        this.$store.commit("SAVE_USER_INPUT_SEARCH", {
          seach_word: this.input_search.trim()
        });
        if (this.input_search === "") {
          this.isSearching = true;
          if (isEmpty(this.hive_db)) {
            return this.fetchHiveDBList().then(res => {
              console.log(`getHiveList res: `, res);
              this.isSearching = false;
              this.hive_db = res;
              return this.$router.push({ name: "blanksearchresult", params: { db: this.hive_db.dbList[0].id } });
            }, err => {
              console.error(`err: `, err.errmsg);
            });
          } else {
            this.isSearching = false;
            return this.$router.push({ name: "blanksearchresult", params: { db: this.hive_db.dbList[0].id } });
          }
        } else {
          return this.$router.push({
            name: "searchresult",
            query: {
              keyword: this.input_search
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
          pageSize: Number(this.pageSize)
        }).then(res => {
          // console.log(`res: `, res);
          this.table_data = res.dbList.list;
          this.total = Number(res.dbList.total);
          loading.close();
        }, err => {
          console.error(`err: `, err.errmsg);
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
        // console.log(tab, event);
      },
      // 表格行点击
      handleRowClick(row) {
        return this.$router.push({
          name: "blanksearchresult",
          params: { db: row.id }
        });
      },
      handleCurrentPageChange(val) {
        this.pageNum = Number(val);
        return this.fetchIndexData();
      },
      handlePageSizeChange(val) {
        this.pageSize = Number(val);
        return this.fetchIndexData();
      }
    }
  };
</script>

<style lang="stylus" scoped>
    ping_an-orange = #FF6600

    .search-input
        display flex
        flex-direction column
        flex-shrink 0
        width 100%
        height 150px

        h1
            color #303133
            font-size 18px
            line-height 60px
            height 60px
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
        height calc(100% - 200px)

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

            tr:hover
                cursor pointer

    .pagination
        display flex
        position relative
        justify-content center
        height 50px

        .text-total
            position absolute
            left 10px
            align-self center
            padding-top 5px
            line-height 28px
            height 28px
            font-size 13px
            color #909399

            span.num
                color ping_an-orange

    .pagination /deep/ .el-pagination
        display flex
        justify-content center
        align-items center
        padding 5px
        padding-bottom 0

</style>
