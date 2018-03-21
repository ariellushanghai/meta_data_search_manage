<template lang="pug">
    .table-details-container
        // 编辑字段弹出框
        el-dialog.dialog-edit-field(title='字段详情', :visible.sync='dialog_edit_field_visible', width='50%', top='50px', append-to-body='', modal-append-to-body='', lock-scroll='', :show-close='true', :close-on-click-modal='false', :close-on-press-escape='false', close='handleCloseEditField')
            el-form(:model='form_edit_field', :disabled='isSubmittingFieldForm', label-width="100px", size='small', class="form-edit-field")
                .non-editable-area
                    el-form-item(label='字段名称: ', prop='fieldName')
                        el-input(v-model='form_edit_field.fieldName', :disabled='true', :style='{"width": "200px"}')

                    el-form-item(label='字段类型:', prop='fieldType')
                        el-input(v-model='form_edit_field.fieldType', :disabled='true', :style='{"width": "200px"}')

                    el-form-item(label='创建时间: ', prop='fieldCreateTime')
                        el-input(v-model='form_edit_field.fieldCreateTime', :disabled='true', :style='{"width": "200px"}')

                    el-form-item(label='更新时间:', prop='fieldUpdateTime')
                        el-input(v-model='form_edit_field.fieldUpdateTime', :disabled='true', :style='{"width": "200px"}')

                    el-form-item(label='是否主键:', prop='isPrimarykey')
                        el-switch(v-model='form_edit_field.isPrimarykey', :disabled='true', active-text='是', :active-value='Number(1)', inactive-text='否', :inactive-value='Number(0)')
                .editable-area
                    el-form-item(label='字段描述: ', prop='descr')
                        el-input(v-model='form_edit_field.descr', type='textarea', :style='{"width": "200px"}')

                    el-form-item(label='统计口径: ', prop='statisticsCalibre')
                        el-input(v-model='form_edit_field.statisticsCalibre', :style='{"width": "200px"}')

                    el-form-item(label='字段码值: ', prop='statisticsCalibre')
                        el-input(v-model='form_edit_field.statisticsCalibre', :style='{"width": "200px"}')

                    el-form-item(label='允许空值:', prop='isAllowNull')
                        el-switch(v-model='form_edit_field.isAllowNull', active-text='是', :active-value='Number(1)', inactive-text='否', :inactive-value='Number(0)')

                    el-form-item(label='是否敏感信息:', prop='isSensitiveInfo')
                        el-switch(v-model='form_edit_field.isSensitiveInfo', active-text='是', :active-value='Number(1)', inactive-text='否', :inactive-value='Number(0)')

            div(slot="footer")
                el-button(size="mini") 保存
                el-button(size="mini") 取消
        // 编辑标签弹出框
        el-dialog.dialog-edit-tags(title='编辑标签', :visible.sync='dialog_edit_tags_visible', width='50%', top='50px', append-to-body='', modal-append-to-body='', lock-scroll='', :show-close='true', :close-on-click-modal='false', :close-on-press-escape='false', close='handleCloseEditTags')
            el-form(:model='form_edit_tags', @submit.native.prevent="", :disabled='isSubmittingTagsForm', label-width="100px", size='small', class="form-edit-tags")
                el-form-item(label='请输入: ', prop='new_tag')
                    el-input(v-model.trim='form_edit_tags.new_tag', placeholder='标签名', @keyup.enter.native="handleNewTagInput", @blur="handleNewTagInput", :style='{"width": "200px"}')


        .table-metas
            .entries
                .entry(v-for='entry in tableMetas', :key='entry.name')
                    span.display-name {{entry.display_name + ' : '}}
                    span.value {{entry.value}}
            .tags
                .tags-title
                    | 标签 :
                el-button.btn-add-tags(@click="openFormAddTags", type="primary" icon="el-icon-plus", size="mini", round='', plain='')
                el-tag(v-for='(tag, idx) in tableMetaTags', @close="handleDelTag(tag)", :key='tag', closable='', size='medium') {{tag}}

        .table
            el-tabs(v-model='activeTabName', @tab-click='handleTabClick' type='border-card')
                el-tab-pane(label='基本信息查询' name='basic_info')
                    el-table.table-basic-info(:data="tableBasicInfo", @current-change="handleCurrentRowChangeBasicInfo", :highlight-current-row='true', :border='true', :stripe='true', size='mini')
                        el-table-column(prop="fieldName", label="字段名称", :sortable="true", :show-overflow-tooltip='true')
                        el-table-column(prop="isPrimarykey", label="是否主键", :sortable="true", align="center", width='100')
                            template(slot-scope="scope")
                                span.check(v-if="checkOrX(scope.row.isPrimarykey) === '✓'")
                                    | ✓
                                span.x(v-if="checkOrX(scope.row.isPrimarykey) === '✕'")
                                    | ✕
                        el-table-column(prop="fieldType", label="字段类型", :sortable="true")
                        el-table-column(prop="fieldCreateTime", label="创建时间")
                        el-table-column(prop="fieldUpdateTime", label="更新时间")
                        el-table-column(prop="descr", label="字段描述")
                        el-table-column(prop="statisticsCalibre", label="统计口径", :sortable="true")
                        el-table-column(prop="isSensitiveInfo", label="敏感信息", :sortable="true", align="center", width='100')
                            template(slot-scope="scope")
                                span.check(v-if="checkOrX(scope.row.isSensitiveInfo) === '✓'")
                                    | ✓
                                span.x(v-if="checkOrX(scope.row.isSensitiveInfo) === '✕'")
                                    | ✕
                        el-table-column(prop="isAllowNull", label="允许空值", :sortable="true", align="center", width='100')
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
  import {extend, map, assign, pick, isEmpty, isNumber, filter, debounce} from 'lodash'
  import format from 'date-fns/format'

  const zh_cn = require('date-fns/locale/zh-CN');

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
        dialog_edit_field_visible: false,
        dialog_edit_tags_visible: false,
        isSubmittingFieldForm: false,
        isSubmittingTagsForm: false,
        form_edit_field: {},// 选中编辑的字段副本
        form_edit_tags: {
          new_tag: ''
        },// 选中编辑的字段副本
        tmpl_form_edit_field: {
          "statisticsCalibre": null,
          "isSensitiveInfo": 1,
          "isAllowNull": 1,
          "codeValueType": null
        },

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
        // return this.table_basic_info;
        return map(this.table_basic_info, (row) => {
          return assign(row, {
            "fieldCreateTime": format(
              new Date(row.fieldCreateTime),
              'YYYY[年]MMMD[日]Ah[点]mm[分]ss[秒]',
              {locale: zh_cn}
            ),
            "fieldUpdateTime": format(
              new Date(row.fieldUpdateTime),
              'YYYY[年]MMMD[日]Ah[点]mm[分]ss[秒]',
              {locale: zh_cn}
            ),
            "modifyTime": format(
              new Date(row.modifyTime),
              'YYYY[年]MMMD[日]Ah[点]mm[分]ss[秒]',
              {locale: zh_cn}
            )
          })
        });
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
      handleCurrentRowChangeBasicInfo(row) {
        console.log('handleCurrentRowChangeBasicInfo() : ', JSON.stringify(row));
        if (this.dialog_edit_field_visible) {
          return false;
        }
        this.form_edit_field = extend({}, row);
        return this.dialog_edit_field_visible = true;
      },
      handleCloseEditField() {

      },
      handleDelTag(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        // this.table_metas.tags
      },
      handleNewTagInput() {
        // this.table_metas.tags
        if (this.form_edit_tags.new_tag !== '') {
          let arr = this.table_metas.tags.split(',');
          arr.push(this.form_edit_tags.new_tag);
          this.table_metas.tags = arr.join(',');
        }
        this.form_edit_tags.new_tag = '';
        return this.dialog_edit_tags_visible = false;
      },
      openFormAddTags() {
        if (this.dialog_edit_tags_visible) {
          return false;
        }
        this.form_edit_tags.new_tag = '';
        return this.dialog_edit_tags_visible = true;
      },
      checkOrX(v) {
        return Number(v) === 0 ? '✕' : '✓';
      }
    }
  }
</script>

<style lang="stylus" scoped>
    .form-edit-field
        display flex
        > div
            width 50%

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
        position relative
        flex-shrink 0
        padding-bottom 30px
        width 25%
        min-width 200px
        border-left 1px solid #dcdfe6
        flex-wrap wrap
        justify-content flex-start
        align-content start
        align-items baseline

        .btn-add-tags
            /*position absolute*/
            /*bottom 0*/
            /*margin-bottom 5px*/
            /*right 0*/
            margin-right 5px
            max-height 30px

        .tags-title
            padding 0 5px
            line-height 50px
            min-width 85px
            color #1d1d1b
            font-weight bold

        .el-tag
            margin .5em
            user-select none

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

    .table-basic-info
        overflow-y auto
        /deep/ .el-table__row:hover
            cursor pointer

        /deep/ .el-table__body tr.el-table__row.current-row > td
            background-color #FF6600
            border-right 1px solid #fff
            .cell
                color #fff
                font-weight bold
                span
                    color #fff

        /deep/ .el-table__row.current-row:hover
            cursor none

    .table-basic-info::before
        height 0

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
