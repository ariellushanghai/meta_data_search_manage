<template lang="pug">
    el-container
        el-main.main
            .tabs-container
                el-tabs(v-model='active_tab_name', @tab-click='handleTabClick' type='border-card')
                    el-tab-pane(label='Hive' name='hive')
                        .search-result-container
                            search-result-table(:keyword='keyword', :type='type', v-on:clickOnSearchResult='handleSelectSearchResult')
                        //- 搜索结果条目对应的详情挂载点: 库，表，字段详情
                        |
                        .result-details
                            transition(name='fade', mode='out-in', :appear='true')
                                keep-alive
                                    component(v-bind:is='result_details_view', :db_id='selected_db_id', :table_id='selected_table_id', :high_light_field_id='selected_field_id')


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
        selected_field_id: null
      };
    },
    computed: {
      keyword() {
        return this.$route.query.keyword;
      },
      type() {
        return this.$route.query.type;
      }
    },
    beforeRouteUpdate(to, from, next) {
      console.log(`beforeRouteUpdate: to: `, to.query.keyword, `, from: `, from.query.keyword);
      return next();
    },
    methods: {
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
            this.selected_db_id = Number(item.id);
            break;
          case "table":
            this.result_details_view = "TableDetails";
            this.selected_table_id = Number(item.id);
            break;
          case "field":
            this.result_details_view = "TableDetails";
            this.selected_table_id = Number(item.tableId);
            this.selected_field_id = Number(item.id);
            break;
          default:
            console.error(`item.type: ${item.type}`);
        }
      }
    }
  };
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
