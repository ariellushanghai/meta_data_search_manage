<template lang="pug">
    .search-result-table
        .tabs
            el-radio-group(v-model='active_filter', size='medium')
                el-radio-button.all(label='全部')
                |
                el-radio-button.db(label='库')
                |
                el-radio-button.table(label='表')
                |
                el-radio-button.field(label='字段')
        |
        .list(v-if='search_result_list.length !== 0')
            .item(v-for='(item, index) in search_result_list', @click='handleSelectSearchResult(item, index)', :key='item.name', v-bind:class="{'highlighted': item.highlight}")
                .label(:class="item.type")
                    span {{convertTypeToZh(item.type)}}

                .main
                    |
                    .header
                        .hierarchy(v-if='item.type === "db"')
                        |
                        .hierarchy(v-if='item.type === "table"', :style='{width: "25%"}')
                            .box
                                .db 库
                                .text {{item.dbName}}

                        |
                        .hierarchy(v-if='item.type === "field"', :style='{width: "50%"}')
                            .box(:style='{width: "50%"}')
                                .db 库
                                .text {{item.dbName}}
                            .box(:style='{width: "50%"}')
                                .table 表
                                .text {{item.tableName}}
                        |
                        .title-container
                            .title(v-html='item.highLightName')
                            |
                            span.count(v-if='item.type === "db"')
                                | {{"表数量: " + item.cnt}}
                            |
                            span.count(v-if='item.type === "table"')
                                | {{'字段数量: ' + item.cnt}}

                    |
                    .content {{item.descr}}
        |
        .pagination-container
            el-pagination(@current-change='handleCurrentPageChange', :current-page.sync='current_page', :page-size='10', layout='total, prev, pager, next', :total='1000', :background='true', :small='true')

</template>

<script>
  import API from '@/service/api'
  import icon_all from '@/assets/images/icon_all.png'
  import icon_db from '@/assets/images/icon_db.png'
  import icon_table from '@/assets/images/icon_table.png'
  import icon_field from '@/assets/images/icon_field.png'
  import { map, extend } from 'lodash'
  import ElTabPane from "element-ui/packages/tabs/src/tab-pane";

  export default {
    components: { ElTabPane },
    name: "SearchResultTable",
    props: ['keyword'],
    data() {
      return {
        icon_all,
        icon_db,
        icon_table,
        icon_field,
        active_filter: '全部',
        current_page: 1,
        page_total: 0,
        search_result_list: []
      };
    },
    computed: {
      currentTableList() {
        return this.current_table_list.filter((table) => table.tableName.toLowerCase().includes(String(this.text_filter_for_tables).toLowerCase()))
      },
      queryType() {
        return {
          '全部': 'all',
          '库': 'db',
          '表': 'table',
          '字段': 'field'
        }[this.active_filter];
      }
    },
    mounted() {
      console.log(`ResultItemTable: 'keyword': ${this.keyword}`);
      this.getResultItem();
    },
    watch: {
      queryType: function(new_type, old_type) {

      }
    },
    methods: {
      getResultItem() {
        let loading = this.$loading({
          target: '.search-result-table .el-tabs__content',
          lock: true,
          text: '正在搜索。。。',
          background: 'rgba(255,255,255,0.3)'
        });
        return API.getSearchResult().then(res => {
          console.log(`getSearchResult() => `, res);
          this.search_result_list = map(res.list, (item) => {
            return extend(item, {
              'highlight': false
            })
          });
          this.page_total = Number(res.total);
          loading.close();
        }, err => {
          console.error(`err: `, err);
          loading.close();
          this.$notify({
            message: `${err.message}`,
            type: 'error',
            duration: 0
          });
        });
      },
      // 搜索结果按全部,库,表,字段过滤
      handleActiveFilterChange() {

      },
      // 搜索结果页分页
      handleCurrentPageChange(val) {
        console.log(`当前页: ${val}`);
        this.current_page = Number(val);
        // return this.fetchData();
      },
      // 用户点击搜索结果
      handleSelectSearchResult(item, index) {
        // item.highlight = true;
        this.search_result_list = map(this.search_result_list, (elem, idx) => {
          elem.highlight = (index === idx);
          return elem;
        });
        console.log(`<SearchResultTable/>: clickOnSearchResult: `, item, index);
        return this.$emit('clickOnSearchResult', item);
      },
      // 中文转换搜索结果的type
      convertTypeToZh(zh) {
        return {
          'all': '全部',
          'db': '库',
          'table': '表',
          'field': '字段'
        }[zh];
      }
    }
  }
</script>

<style lang="stylus" scoped>
    ping_an-orange = #FF6600
    custom-grey = #ebeef5

    .search-result-table
        display flex
        flex-direction column
        width 100%
        height 100%
        overflow hidden

        .tabs
            height 36px
            width 100%

            label.all
                background-color white
                /deep/ .el-radio-button__inner
                    background-color white

            label.db
                color #67C23A
                /deep/ .el-radio-button__inner
                    color #67C23A

            label.table
                color #0277BD
                /deep/ .el-radio-button__inner
                    color #0277BD

            label.field
                color #AD1457
                /deep/ .el-radio-button__inner
                    color #AD1457

            /deep/ .el-radio-group
                width 100%

                label
                    width 25%

                    /deep/ .el-radio-button__inner
                        width 100%
                        border-radius 0

                        /deep/ img
                            display inline-block
                            width 14px
                            height 14px
                            vertical-align middle
                            margin-right .5em

            /deep/ .el-radio-button__orig-radio:checked + .el-radio-button__inner
                background-color initial
                color ping_an-orange
                border 1px solid ping_an-orange
                box-shadow 0 0 0 0 ping_an-orange

            /deep/ .el-radio-button__inner:hover
                color ping_an-orange

        .list
            width 100%
            padding 15px 5px
            height calc(100% - 32px - 36px)
            overflow-y auto
            background-color #f5f7fa

            .item
                display flex
                align-items stretch
                width 100%
                overflow hidden
                margin-bottom 15px
                border-radius 4px
                background-color #f5f7fa
                border 2px solid rgba(0, 0, 0, 0)
                box-shadow 0 2px 12px 0 rgba(0, 0, 0, .1)
                color #303133
                will-change border-color
                transition all .1s ease

                .label
                    display flex
                    align-items center
                    justify-content center
                    width 25px
                    min-width 25px
                    font-size 14px

                    span
                        text-align center
                        vertical-align middle
                        color white

                .db
                    background #67C23A
                .table
                    background #0277BD
                .field
                    background #AD1457

                .main
                    width calc(100% - 25px)

                    .header
                        display flex
                        width 100%
                        height 50px
                        line-height 50px
                        font-size 13px
                        text-align center
                        background-color white
                        border-bottom 1px solid custom-grey

                        .title-container
                            flex-grow 1
                            position relative
                            padding 0 2.5px
                            height 100%
                            max-width 100%

                            .title
                                line-height 50px
                                height 100%
                                overflow hidden
                                text-overflow ellipsis
                                word-break break-all
                                white-space nowrap
                                text-transform uppercase

                                /deep/ span.highlight
                                    color ping_an-orange
                                    font-weight bold

                            span.count
                                position absolute
                                bottom 2.5px
                                right 2.5px
                                color #3492ff
                                font-size 10px
                                line-height 10px

                        .hierarchy
                            display flex
                            max-width 50%

                            .box
                                display flex
                                max-width 100%
                                height 100%
                                line-height initial
                                flex-direction column
                                flex-grow 1

                                > div
                                    height 50%
                                    line-height 25px

                                .db, .table
                                    color white

                                .text
                                    padding 0 .5em
                                    overflow hidden
                                    text-overflow ellipsis
                                    word-break break-all
                                    white-space nowrap
                                    font-size 11px
                                    border-right 1px solid custom-grey

                    .content
                        background-color white
                        height 50px
                        padding 5px
                        line-height 13.333px
                        font-size 13.333px
                        overflow-x hidden
                        overflow-y auto

            .item.highlighted
                border-color ping_an-orange
            .item.highlighted:hover
                cursor unset

            .item:hover
                cursor pointer

            .item:last-of-type
                margin-bottom 0

        .pagination-container
            height 32px
            display flex
            justify-content center

            /deep/ .el-pagination
                display flex
                justify-content center
                align-items center

        /deep/ .el-tabs__header
            margin-bottom 0

        /deep/ .el-tabs__content
            padding 5px

        /deep/ .el-tabs__nav
            width 100%

            .el-tabs__active-bar
                background-color ping_an-orange

        /deep/ .el-tabs__item:hover
            color ping_an-orange

        /deep/ .el-tabs__item
            width 25%
            text-align center
            user-select none
            height 30px
            line-height 30px
            color #fff

            img
                display inline-block
                width 14px
                height 14px
                vertical-align middle
                margin-right .5em

</style>
