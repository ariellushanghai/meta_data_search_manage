<template lang="pug">
    .db-table-tree-menu
        .dbs
            el-table(:data='db_list', @current-change='handleDbListCurrentRowChange', :highlight-current-row='true', :show-header='false', size='mini')
                el-table-column(:show-overflow-tooltip='true')
                    template(slot-scope='scope')
                        img(:src='icon_db')
                        span(style='font-size: 14px;') {{scope.row.name}}

        .tables
            .text-filter
                el-input(placeholder='过滤表格名', v-model='text_filter_for_tables', :fit='true', size='mini')
                    img(slot='prefix')
            .list
                el-table(:data='currentTableList', @current-change='handleTableListCurrentRowChange', :highlight-current-row='true', :show-header='false', size='mini')
                    el-table-column(:show-overflow-tooltip='true')
                        template(slot-scope='scope')
                            img(:src='icon_table')
                            span(style='font-size: 14px;') {{scope.row.tableName}}


</template>

<script>
  import API from '@/service/api'
  import icon_db from '@/assets/images/icon_db.png'
  import icon_table from '@/assets/images/icon_table.png'
  import icon_arrow_forward from '@/assets/images/ic_arrow_forward_black_48dp.png'
  import {filter, debounce} from 'lodash'

  export default {
    name: "DbTableTreeMenu",
    props: [],
    data() {
      return {
        icon_db,
        icon_table,
        icon_arrow_forward,
        isLoadingDbList: false,
        isLoadingTableList: false,
        db_list: [],
        current_table_list: [],
        text_filter_for_tables: ''
      };
    },
    computed: {
      currentTableList() {
        return this.current_table_list.filter((table) => table.tableName.toLowerCase().includes(String(this.text_filter_for_tables).toLowerCase()))
      }
    },
    mounted() {
      this.fetchHiveDbList();

    },
    beforeDestroy: function () {

    },
    methods: {
      fetchHiveDbList() {
        console.log('fetchHiveDbList()');
        this.isLoadingDbList = true;
        API.getHiveDBList({}).then(res => {
          this.isLoadingDbList = false;
          this.db_list = res.dbList;
        }, err => {
          console.error(`err: `, err);
          this.$notify({
            message: `${err}`,
            type: 'error',
            duration: 0
          });
          this.isLoadingDbList = false;
        });
      },
      handleDbListCurrentRowChange(val) {
        console.log(`handleDbListCurrentRowChange() id: => `, val.id);
        if (this.isLoadingTableList) {
          return false;
        }
        return this.fetchTablesByDbId(val.id);
      },
      handleTableListCurrentRowChange(val) {
        console.log(`handleTableListCurrentRowChange() id: => `, val.id);
        // if (this.isLoadingTableList) {
        //   return false;
        // }
        // return this.fetchTablesByDbId(val.id);
      },
      fetchTablesByDbId(db_id) {
        console.log('fetchTablesByDbId()');
        this.isLoadingTableList = true;
        return API.fetchTablesByDbId({db_id: db_id}).then(res => {
          this.isLoadingTableList = false;
          this.current_table_list = res.tableList;
        }, err => {
          console.error(`err: `, err);
          this.$notify({
            message: `${err}`,
            type: 'error',
            duration: 0
          });
          this.isLoadingTableList = false;
        });
      }
    }
  }
</script>

<style lang="stylus" scoped>
    .db-table-tree-menu
        display flex
        width 100%
        height 100%
        overflow hidden

    .dbs, .tables .list
        overflow-x hidden
        overflow-y auto
        padding 0

        /deep/ .el-table::before
            height 0

        /deep/ .el-table
            overflow-y auto
            scroll-behavior smooth

            td
                border-bottom 1px solid white

            td:hover
                cursor pointer

            .cell
                line-height 20px

                span
                    color #1D1D1B
                    font-size 15px
                    line-height 20px

                img
                    display inline-block
                    width 20px
                    height auto
                    vertical-align top
                    margin-right .5em

    .dbs
        width 40%
        height 100%

    .tables
        flex-grow 1
        width auto
        height 100%

        .text-filter
            height 30px

        .list
            height calc(100% - 30px)


</style>
