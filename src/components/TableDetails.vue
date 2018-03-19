<template lang="pug">
    .table-details-container
        .table-metas
            .entries
                .entry(v-for='entry in tableMetas', :key='entry.name')
                    span.display-name {{entry.display_name + ' : '}}
                    span.value {{entry.value}}
            .tags
                el-tag(v-for='(tag, idx) in tableMetaTags', :key='idx', size='medium') {{tag}}

        .table
            el-tabs(v-model='activeTabName', @tab-click='handleTabClick' type='border-card')
                el-tab-pane(label='基本信息查询' name='basic_info')
                    el-table(:data="tableBasicInfo", :highlight-current-row='true', size='mini')
                        el-table-column(prop="fieldName", label="字段名称")
                        el-table-column(prop="isPrimarykey", label="是否主键")
                        el-table-column(prop="fieldType", label="字段类型")
                        el-table-column(prop="fieldCreateTime", label="创建时间")
                        el-table-column(prop="fieldUpdateTime", label="更新时间")
                        el-table-column(prop="fieldUpdateTime", label="字段说明")
                        el-table-column(prop="statisticsCalibre", label="统计口径")
                        el-table-column(prop="isSensitiveInfo", label="是否敏感信息")
                        el-table-column(prop="isAllowNull", label="是否允许空值")
                        el-table-column(prop="statisticsCalibre", label="字段码值")

                el-tab-pane(label='人员权限查询' name='authed_people') 人员权限查询
                el-tab-pane(label='变更历史查询' name='modified_log') 变更历史查询
                el-tab-pane(label='血缘关系查询(暂无)' name='relations', :disabled="true") 血缘关系查询


</template>

<script>
  import API from '@/service/api'
  import icon_db from '@/assets/images/icon_db.png'
  import icon_table from '@/assets/images/icon_table.png'
  import icon_arrow_forward from '@/assets/images/ic_arrow_forward_black_48dp.png'
  import {extend, map, pick, isEmpty, isNumber, filter, debounce} from 'lodash'

  export default {
    name: "TableDetails",
    props: ['table_id'],
    data() {
      return {
        icon_db,
        icon_table,
        icon_arrow_forward,
        mapping: {
          "dbName": "库名",
          "tableName": "表名",
          "amount": "数据量",
          "tableCreateTime": "创建时间",
          "tableEffectTime": "生效时间",
          "tableUpdateTime": "更新时间",
          "dataOwner": "数据归属",
          "devOwner": "开发归属",
          "businessOwner": "口径归属"
        },
        isLoadingTable: false,
        table_basic_info: [],
        table_metas: {},
        activeTabName: 'basic_info'
      };
    },
    computed: {
      tableBasicInfo() {
        if (isEmpty(this.table_basic_info)) {
          return [];
        }
        return this.table_basic_info;
      },
      tableMetas() {
        if (isEmpty(this.table_metas)) {
          return [];
        }
        return map(pick(this.table_metas, ['dbName', 'tableName', 'amount', 'tableCreateTime', 'tableEffectTime', 'tableUpdateTime', 'dataOwner', 'devOwner', 'businessOwner']), (v, k) => {
          console.log(v, k);
          return {
            display_name: this.mapping[k],
            value: v
          };
        });
      },
      tableMetaTags() {
        if (this.table_metas.tags && this.table_metas.tags !== '') {
          return this.table_metas.tags.split(',');
        }
        return []
      }
    },
    mounted() {
      // this.fetchTable();

    },
    watch: {
      'table_id'(new_id, old_id) {
        console.log(`table_id changed: new_id : `, new_id, `old_id:`, old_id);
        if (isNumber(Number(this.table_id)) && Number(this.table_id) !== 0) {
          return this.fetchTable(Number(this.table_id))
        }
      }
    },
    methods: {
      fetchTable(id) {
        console.log(`fetchTable(${id})`);
        this.isLoadingTable = true;
        API.getTableById({id: id}).then(res => {
          this.isLoadingTable = false;
          this.table_metas = extend({}, res.tableInfo);
          this.table_basic_info = res.fieldList;
        }, err => {
          console.error(`err: `, err);
          this.$notify({
            message: `${err}`,
            type: 'error',
            duration: 0
          });
          this.isLoadingTable = false;
        });
      },
      handleTabClick(tab, event) {
        console.log(tab, event);
      }
    }
  }
</script>

<style lang="stylus" scoped>
    .table-details-container
        display flex
        flex-direction column
        width 100%
        height 100%
        overflow hidden
        padding 5px

    .table-metas
        display flex
        width 100%
        height 150px
        > div {
            display flex
            height 100%
            max-height 100%
            overflow-x hidden
            overflow-y auto
        }

    .entries
        width 75%
        flex-wrap wrap

        .entry
            display flex
            width 33.33%
            height 50px
            line-height 50px
            .value
                width 67%
                overflow hidden
                text-overflow ellipsis
                white-space nowrap
                word-break break-all
                vertical-align middle

            .display-name
                color #1d1d1b
                width 33%
                font-weight bold

    .tags
        width 25%
        flex-wrap wrap
        justify-content flex-start
        align-content start

        .el-tag
            margin .5em

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

    .table
        flex-grow 1
        width 100%
        height calc(100% - 150px)
        overflow hidden


</style>
