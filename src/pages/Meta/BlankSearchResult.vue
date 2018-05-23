<template lang="pug">
    el-container
        el-main.main
            .tabs-container
                el-tabs(v-model='activeTabName', @tab-click='handleTabClick', type='border-card')
                    el-tab-pane(label='Hive', name='hive')
                        .hives-and-tables
                            db-table-tree-menu(:db_id='currentDbId', v-on:select_hive='handleSelectHive', v-on:select_table='handleSelectTable')
                        |
                        .selected-table
                            |
                            transition(v-if='selected_table_id', name="fade")
                                table-details(:table_id='selected_table_id')
                            |
                            transition(v-else, name="fade")
                                .empty-place-holder
                                    span ←请选择您所需要查看的数据表

                    |
                    el-tab-pane(label='标签系统(暂无)', name='labelsys', :disabled='true') 标签系统系
                    |
                    el-tab-pane(label='TimeLine(暂无)', name='timeline', :disabled='true') TimeLine
</template>

<script>
  // @flow
  import DbTableTreeMenu from "@/components/DbTableTreeMenu.vue";
  import TableDetails from "@/components/TableDetails.vue";
  import ElContainer from "element-ui/packages/container/src/main";
  import ElMain from "element-ui/packages/main/src/main";
  import { map, assign } from "lodash";


  export default {
    components: {
      ElMain,
      ElContainer,
      DbTableTreeMenu,
      TableDetails
    },
    name: "BlankSearchResult",
    metaInfo: {
      titleTemplate: "%s-无匹配搜索结果"
    },
    data() {
      return {
        selected_hive_id: null,
        selected_table_id: null,
        activeTabName: "hive"
      };
    },
    computed: {
      currentDbId: function() {
        return `${this.$route.params.db}`;
      }
    },
    mounted() {
      this.$store.commit("SAVE_USER_INPUT_SEARCH", {
        seach_word: ""
      });
    },
    methods: {
      handleSelectTable(table_id) {
        console.log(`handleSelectTable(${table_id})`);
        return this.selected_table_id = table_id;
      },
      handleSelectHive(hive_id) {
        console.log(`handleSelectHive(${hive_id})`);
        return this.$router.push({ name: "blanksearchresult", params: { db: hive_id } });
        // return this.selected_hive_id = hive_id;
      },
      handleTabClick(tab, event) {
        console.log(tab, event);
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
            width 100%
            height 100%
            overflow hidden

    .hives-and-tables
        flex-shrink 0
        width 33%
        /*min-width 500px*/
        /*max-width 600px*/
        padding 5px

    .selected-table
        flex-grow 1
        width 67%
        padding 5px

        .empty-place-holder
            display flex
            color #C0C4CC
            width 100%
            height 100%
            text-align center
            justify-content center
            align-items center
</style>
