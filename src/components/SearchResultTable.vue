<template lang="pug">
    <!--.search-result-table-->
    <!--.tabs-->
    <!--el-tabs(v-model='active_filter', @tab-click="handleActiveFilterChange")-->
    <!--el-tab-pane(name='all')-->
    <!--.tab-all(slot='label')-->
    <!--img(:src="icon_all")-->
    <!--span 全部-->
    <!--result-item(:list='searchResultList', v-on:clickOnSearchResult='handleSelectSearchResult')-->

    <!--el-tab-pane(name='db')-->
    <!--.tab-db(slot='label')-->
    <!--img(:src="icon_db")-->
    <!--span 库-->
    <!--result-item(:list='searchResultList', v-on:clickOnSearchResult='handleSelectSearchResult')-->

    <!--el-tab-pane(name='table')-->
    <!--.tab-table(slot='label')-->
    <!--img(:src="icon_table")-->
    <!--span 表-->
    <!--result-item(:list='searchResultList', v-on:clickOnSearchResult='handleSelectSearchResult')-->

    <!--el-tab-pane(name='field')-->
    <!--.tab-field(slot='label')-->
    <!--img(:src="icon_field")-->
    <!--span 字段-->
    <!--result-item(:list='searchResultList', v-on:clickOnSearchResult='handleSelectSearchResult')-->


    .search-result-table
        .tabs
            el-radio-group(v-model="active_filter", size="medium")
                el-radio-button.all(label='全部')
                    img(:src="icon_all")
                    span 全部
                el-radio-button.db(label='库')
                    img(:src="icon_db")
                    span 库
                el-radio-button.table(label='表')
                    img(:src="icon_table")
                    span 表
                el-radio-button.field(label='字段')
                    img(:src="icon_field")
                    span 字段

        .list
            result-item(:list='searchResultList', v-on:clickOnSearchResult='handleSelectSearchResult')

        .pagination-container
            el-pagination(@current-change="handleCurrentPageChange", :current-page.sync="current_page", :page-size="10", layout="total, prev, pager, next", :total="1000", :background="true", :small='true')

</template>

<script>
  import API from '@/service/api'
  import icon_all from '@/assets/images/icon_all.png'
  import icon_db from '@/assets/images/icon_db.png'
  import icon_table from '@/assets/images/icon_table.png'
  import icon_field from '@/assets/images/icon_field.png'
  import {isEmpty, filter, map, extend} from 'lodash'
  import ResultItem from '@/components/ResultItem.vue'
  import ElTabPane from "element-ui/packages/tabs/src/tab-pane";

  export default {
    components: {ResultItem, ElTabPane},
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
        raw_search_result: []
      };
    },
    computed: {
      currentTableList() {
        return this.current_table_list.filter((table) => table.tableName.toLowerCase().includes(String(this.text_filter_for_tables).toLowerCase()))
      },
      searchResultList() {
        if (isEmpty(this.raw_search_result)) {
          return []
        }
        return map(this.raw_search_result, (item) => {
          return extend(item, {
            'highlight': false
          })
        });
      }
    },
    mounted() {
      console.log(`ResultItemTable: 'keyword': ${this.keyword}`);
      this.getResultItem();
    },
    beforeDestroy: function () {

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
          this.raw_search_result = res.list;
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
      handleSelectSearchResult(item) {
        // console.log(`handleSelectSearchResult(): `, item);
        return this.$emit('clickOnSearchResult', item);
      }
    }
  }
</script>

<style lang="stylus" scoped>
    ping_an-orange = #FF6600

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



            /deep/ .el-radio-button__orig-radio:checked+.el-radio-button__inner
                background-color initial
                color ping_an-orange
                border 1px solid ping_an-orange
                box-shadow 0 0 0 0 ping_an-orange

            /deep/ .el-radio-button__inner:hover
                color ping_an-orange

        .pagination-container
            height 32px
            display flex
            justify-content center

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

        /deep/ .is-active
            font-weight bold
            color ping_an-orange

        /deep/ #tab-all
            background-color white

        /deep/ #tab-db
            background-color #67C23A

        /deep/ #tab-table
            background-color #0277BD

        /deep/ #tab-field
            background-color #AD1457

</style>
