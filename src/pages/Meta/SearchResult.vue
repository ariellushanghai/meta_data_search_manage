<template lang="pug">
    el-container
        //- 表格详情容器
        //- el-dialog.dialog-table-details(title='表格详情', :visible.sync='dialog_table_details_visible', width='66%', top='50px', append-to-body='', modal-append-to-body='', lock-scroll='', :show-close='true', :close-on-click-modal='false', :close-on-press-escape='false', close='handleCloseTableDetails')
            table-details(:table_id='selected_table_id', v-show='selected_table_id')
        |
        el-main.main
            .tabs-container
                el-tabs(v-model='active_tab_name', @tab-click='handleTabClick' type='border-card')
                    el-tab-pane(label='Hive' name='hive')
                        .search-result-container
                            search-result-table(v-show='!isInChildrenTable', :keyword='keyword', :type='type', v-on:clickOnSearchResult='handleSelectSearchResult', v-on:changeSearch='handleChangeSearch')
                            |
                            .back-to-belong-db(v-show='isInChildrenTable')
                                el-button(@click='backToBelongDb' type="primary" icon="el-icon-arrow-left" size="mini") 返回数据库详情
                        //- 搜索结果条目对应的详情挂载点: 库，表，字段详情
                        |
                        .result-details
                            //- transition(name='fade', mode='out-in', :appear='true')
                            keep-alive
                                component(v-bind:is='result_details_view', :db_id='selected_db_id', :table_id='selected_table_id', :high_light_field_id='selected_field_id', v-on:select_table='handleSelectTable')
                    |
                    el-tab-pane(label='标签系统(暂无)' name='labelsys', :disabled='true') 标签系统

                    el-tab-pane(label='TimeLine(暂无)' name='timeline', :disabled='true') TimeLine
</template>

<script>
  // @flow
  import SearchResultTable from "@/components/SearchResultTable.vue";
  import DbTableTreeMenu from "@/components/DbTableTreeMenu.vue";
  import DbDetails from "@/components/DbDetails.vue";
  import TableDetails from "@/components/TableDetails.vue";
  import ElContainer from "element-ui/packages/container/src/main";
  import ElMain from "element-ui/packages/main/src/main";

  export default {
    components: {
      ElMain,
      ElContainer,
      SearchResultTable,
      DbTableTreeMenu,
      DbDetails,
      TableDetails
    },
    name: "SearchResult",
    metaInfo: {
      titleTemplate: "%s-Hive搜索结果"
    },
    data() {
      return {
        active_tab_name: "hive",
        result_details_view: "",
        selected_db_id: null,
        selected_table_id: null,
        selected_field_id: null,
        isInChildrenTable: false,
        cached_selected_db_id: null
      };
    },
    computed: {
      keyword() {
        return this.$route.query.keyword;
      },
      type() {
        console.log(`computed.type: `, this.$route.query.type);
        return this.$route.query.type;
      }
    },
    beforeRouteUpdate(to, from, next) {
      if (to.fullPath === from.fullPath) {
        return next();
      }
      this.resetUI();
      return next();
    },
    mounted() {
      console.log(`<SearchResult/> mounted: keyword: ${this.keyword}, type: ${this.type}`);
    },
    methods: {
      resetUI() {
        this.result_details_view = "";
        this.selected_db_id = null;
        this.selected_table_id = null;
        this.selected_field_id = null;
        this.isInChildrenTable = false;
        this.cached_selected_db_id = null;
      },
      handleTabClick(tab, event) {
        console.log(tab, event);
      },
      // 用户点击搜索结果 => 切换路由
      handleSelectSearchResult(item) {
        console.log(`handleSelectSearchResult(): `, item);
        switch (item.type) {
          case "db":
            console.log("db");
            this.result_details_view = "DbDetails";
            this.selected_db_id = item.id;
            this.selected_table_id = null;
            this.selected_field_id = null;
            break;
          case "table":
            this.result_details_view = "TableDetails";
            this.selected_table_id = item.id;
            this.selected_db_id = null;
            this.selected_field_id = null;
            break;
          case "field":
            this.result_details_view = "TableDetails";
            this.selected_table_id = item.tableId;
            this.selected_field_id = item.id;
            this.selected_db_id = null;
            break;
          default:
            console.error(`item.type: ${item.type}`);
        }
      },
      handleChangeSearch(obj) {
        console.log(`handleChangeSearch(${JSON.stringify(obj)}): `);
        return this.$router.push({
          name: "searchresult",
          query: {
            keyword: obj.keyword,
            type: obj.type
          }
        });
      },
      handleSelectTable(table_id) {
        console.log(`<SearchResult/> .handleSelectTable(${table_id})`);
        this.isInChildrenTable = true;
        this.cached_selected_db_id = this.selected_db_id;
        return this.handleSelectSearchResult({
          type: "table",
          id: table_id
        });
      },
      backToBelongDb() {
        this.isInChildrenTable = false;
        return this.handleSelectSearchResult({
          type: "db",
          id: this.cached_selected_db_id
        });
      }
    }
  };
</script>

<style lang="stylus" scoped>
    .tabs-container
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
        display flex
        flex-shrink 0
        flex-grow 0
        width 550px
        height 100%
        padding 0

    .result-details
        position relative
        width calc(100% - 550px)
        flex-grow 1
        padding 0
        background-color #f5f7fa

    .back-to-belong-db
        display flex
        align-self left
</style>
