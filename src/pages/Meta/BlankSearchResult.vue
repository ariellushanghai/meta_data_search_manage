<template lang="pug">
    el-container
        el-main.main
            .tabs-container
                el-tabs(v-model='activeTabName', @tab-click='handleTabClick', type='border-card')
                    el-tab-pane(label='Hive', name='hive')
                        .hives-and-tables
                            db-table-tree-menu(v-on:selecttable='handleSelectTable')
                        |
                        .selected-table(v-show='selected_table_id !== 0')
                            table-details(:table_id='selected_table_id')
                    |
                    el-tab-pane(label='标签系统(暂无)', name='labelsys', :disabled='true') 标签系统系
                    |
                    el-tab-pane(label='TimeLine(暂无)', name='timeline', :disabled='true') TimeLine

</template>

<script>
  // @flow
  import API from '@/service/api'
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
      DbTableTreeMenu,
      TableDetails
    },
    name: 'BlankSearchResult',
    metaInfo: {
      titleTemplate: '%s-无匹配搜索结果'
    },
    data() {
      return {
        current_db_id: '',
        activeTabName: 'hive',
        selected_table_id: 0
      }
    },
    computed: {
    },
    watch: {
      '$route'(to, from) {
        console.log(`$route changed: to : `, to, `from:`, from);
        if (to.params.db !== from.params.db) {

        }
      }
    },
    mounted() {
      console.log(`无匹配搜索结果 mounted() this.$route.params:`, this.$route.params);
      this.current_db_id = this.$route.params.db;
      this.fetchHiveDBList();
    },
    methods: {
      search() {

      },
      fetchHiveDBList() {
        return API.getHiveDBList({}).then(res => {
          console.log(`getHiveDBList res: `, res);
        }, err => {
          console.error(`err: `, err);
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

    .hives-and-tables
        flex-shrink 0
        width 33%
        min-width 500px
        max-width 600px
        padding 5px

    .selected-table
        flex-grow 1
        padding 5px
</style>
