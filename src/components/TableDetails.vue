<template lang="pug">
    .table-details-container
        .table-metas
            .entries
                .entry(v-for='entry in tableMetas', :key='entry.name')
                    span.display-name {{entry.display_name + ' : '}}
                    span.value {{entry.value}}
            .tags
                .tags-title
                    | 标签 :
                el-tag(v-for='(tag, idx) in tableMetaTags', :key='idx', size='medium') {{tag}}

        .table
            el-tabs(v-model='activeTabName', @tab-click='handleTabClick' type='border-card')
                el-tab-pane(label='基本信息查询' name='basic_info')
                    el-table(:data="tableBasicInfo", :highlight-current-row='true', :border='true', size='mini')
                        el-table-column(prop="fieldName", label="字段名称", :sortable="true")
                        el-table-column(prop="isPrimarykey", label="是否主键", :sortable="true", align="center")
                            template(slot-scope="scope")
                                span.check(v-if="checkOrX(scope.row.isPrimarykey) === '✓'")
                                    | ✓
                                span.x(v-if="checkOrX(scope.row.isPrimarykey) === '✕'")
                                    | ✕
                        el-table-column(prop="fieldType", label="字段类型", :sortable="true")
                        el-table-column(prop="fieldCreateTime", label="创建时间")
                        el-table-column(prop="fieldUpdateTime", label="更新时间")
                        el-table-column(prop="fieldUpdateTime", label="字段说明")
                        el-table-column(prop="statisticsCalibre", label="统计口径", :sortable="true")
                        el-table-column(prop="isSensitiveInfo", label="敏感信息", :sortable="true", align="center")
                            template(slot-scope="scope")
                                span.check(v-if="checkOrX(scope.row.isSensitiveInfo) === '✓'")
                                    | ✓
                                span.x(v-if="checkOrX(scope.row.isSensitiveInfo) === '✕'")
                                    | ✕
                        el-table-column(prop="isAllowNull", label="允许空值", :sortable="true", align="center")
                            template(slot-scope="scope")
                                span.check(v-if="checkOrX(scope.row.isAllowNull) === '✓'")
                                    | ✓
                                span.x(v-if="checkOrX(scope.row.isAllowNull) === '✕'")
                                    | ✕
                        el-table-column(prop="statisticsCalibre", label="字段码值", :sortable="true")

                el-tab-pane(label='人员权限查询' name='authed_people')
                    .authed-people
                        .authed-person(v-for='person in authed_people', :key='person.name')
                            img(:src="icon_person")
                            .names
                                div {{person.name}}
                                div {{person.userName}}

                el-tab-pane(label='变更历史查询' name='modified_log')
                    light-timeline(:items="timeline_data")
                el-tab-pane(label='血缘关系查询(暂无)' name='relations', :disabled="true") 血缘关系查询


</template>

<script>
  import API from '@/service/api'
  import icon_db from '@/assets/images/icon_db.png'
  import icon_table from '@/assets/images/icon_table.png'
  import icon_person from '@/assets/images/ic_person_outline_24px.svg'
  import {extend, map, pick, isEmpty, isNumber, filter, debounce} from 'lodash'

  export default {
    name: "TableDetails",
    props: ['table_id'],
    data() {
      return {
        icon_db,
        icon_table,
        icon_person,
        mapping: {
          "dbName": "所属库名",
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
        authed_people: [],
        timeline_data: [
          {
            tag: '2018-01-12',
            content: 'hallo'
          },
          {
            tag: '2018-01-13',
            content: 'world'
          },
          {
            tag: '2018-01-14',
            content: '=v ='
          }],
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
        return map(pick(this.table_metas, ['tableName', 'dbName', 'amount', 'tableCreateTime', 'tableEffectTime', 'tableUpdateTime', 'dataOwner', 'devOwner', 'businessOwner']), (v, k) => {
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
          this.authed_people = res.peopleList;
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
      },
      checkOrX(v) {
        return Number(v) === 0 ? '✕' : '✓';
      }
    }
  }
</script>

<style lang="stylus" scoped>
    span.check, span.x
        font-size 1.2em

    span.check
        color #67C23A

    span.x
        color #F56C6C

    .table-details-container
        display flex
        flex-direction column
        width 100%
        height 100%
        /*overflow hidden*/
        padding 0
        /deep/ .el-tabs__item
            user-select none

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
            width 33.333%
            height 50px
            line-height 50px
            border-bottom 1px solid #dcdfe6

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
                min-width 85px
                font-weight bold

        .entry:nth-child(7),
        .entry:nth-child(8),
        .entry:nth-child(9) {
            border-bottom none
        }

    .tags
        flex-shrink 0
        width 25%
        min-width 200px
        border-left 1px solid #dcdfe6
        flex-wrap wrap
        justify-content flex-start
        align-content start
        align-items baseline

        .tags-title
            padding 0 5px
            line-height 50px
            min-width 85px
            color #1d1d1b
            font-weight bold

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

    .authed-people
        display flex
        flex-wrap wrap
        align-content flex-start
        width 100%
        padding 0.5%
        height 100%
        overflow-x hidden
        overflow-y auto

        .authed-person
            display flex
            justify-content space-between
            width 15%
            height 100px
            padding .5em
            max-width 200px
            min-width 180px
            margin .5em
            border-radius 4px
            border 1px solid #ebeef5
            overflow hidden
            box-shadow 0 1px 6px 0 rgba(0, 0, 0, .1)

            img
                align-self center
                width 50px
                height 50px

            .names
                display flex
                flex-direction column
                justify-content space-around
                width calc(95% - 50px)
                > div {
                    overflow hidden
                    text-overflow ellipsis
                    white-space nowrap
                    word-break break-all
                    vertical-align middle
                }


</style>
