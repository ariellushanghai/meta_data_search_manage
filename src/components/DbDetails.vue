<template lang="pug">
    .db-details-container
        .db-info
            el-card(:body-style="{padding:'5px',display: 'flex','justify-content': 'space-between'}")
                .clearfix(slot='header')
                    span 数据库详情
                |
                .entry(v-for='entry in dbInfo', :key='entry.name')
                    span.display-name {{entry.display_name + ' : '}}
                    span.value {{entry.value}}
        |
        .tables
            .text-filter
                el-input(placeholder='过滤表格名', v-model='text_filter_for_tables', :clearable='true', :fit='true', size='mini')
                    img(slot='prefix')
            |
            .list
                el-table(:data='tableList', @current-change='handleTableListCurrentRowChange', :highlight-current-row='true', :show-header='false', size='mini')
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
  import {map, pick} from 'lodash'

  export default {
    name: "DbDetails",
    props: ['db_id'],
    data() {
      return {
        icon_db,
        icon_table,
        icon_arrow_forward,
        isLoadingData: false,
        db_info: {},
        table_list: [],
        text_filter_for_tables: '',
        mapping: {
          'name': '库名',
          'tableCnt': '表数量',
          'createTime': '建库时间',
          'dbAdmin': 'Hive管理员',
          'sasPermissionAdmin': 'SAS权限管理员',
          'modifyTime': '最近更新时间'
        }
      };
    },
    computed: {
      dbInfo() {
        return map(pick(this.db_info, ['name', 'tableCnt', 'createTime', 'dbAdmin', 'sasPermissionAdmin', 'modifyTime']),
          (v, k) => {
            console.log(v, k);
            return {
              display_name: this.mapping[k],
              value: v
            };
          });
      },
      tableList() {
        return this.table_list.filter((table) => table.tableName.toLowerCase().includes(String(this.text_filter_for_tables).toLowerCase()))
      }
    },
    mounted() {
      this.getHiveDbById(this.db_id);
    },
    beforeDestroy: function () {

    },
    methods: {
      handleTableListCurrentRowChange(val) {
        console.log(`select_table() val: => `, val);
        return this.$emit('select_table', val.id);
      },
      getHiveDbById(db_id) {
        console.log(`getHiveDbById(${db_id})`);
        this.isLoadingData = true;
        return API.getHiveDbById({db_id: db_id}).then(res => {
          this.isLoadingData = false;
          this.db_info = res;
          this.table_list = res.tableList;
        }, err => {
          console.error(`err: `, err);
          this.$notify({
            message: `${err}`,
            type: 'error',
            duration: 0
          });
          this.isLoadingData = false;
        });
      }
    }
  }
</script>

<style lang="stylus" scoped>
    .db-details-container
        display flex
        align-items stretch
        width 100%
        height 100%
        overflow hidden

    .db-info, .tables .list
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

            .el-table__body tr.current-row > td
                background-color #f60

                .cell span {
                    color white
                    font-weight bold
                }

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

    .db-info
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
