<template lang="pug">
    .list(v-if='list.length !== 0')
        .item(v-for='(item, index) in resultList', @click="handleClick(item, index)", :key="item.name", :class="{highlighted: item.highlight}")
            .header
                .hierarchy(v-if='item.type === "db"')
                    .db.current(v-html='item.highLightName')

                .hierarchy(v-if='item.type === "table"')
                    .table.current(v-html='item.highLightName')
                    el-tooltip(:content='"所属库名: " + item.dbName', effect="light", placement='top')
                        .db {{item.dbName}}

                .hierarchy(v-if='item.type === "field"')
                    .field.current(v-html='item.highLightName')
                    .split-horizion
                        el-tooltip(:content='item.tableName', effect="light", placement='top')
                            .table {{item.tableName}}
                        el-tooltip(:content='item.dbName', effect="light", placement='top')
                            .db {{item.dbName}}

                <!--.name(v-html='item.highLightName')-->

            .content {{item.descr}}

</template>

<script>
  // @flow

  import {isEmpty, map, extend} from 'lodash'

  export default {
    name: 'ResultItem',
    props: ['list'],
    data() {
      return {}
    },
    computed: {
      resultList() {
        return this.list;
      }
    },
    mounted() {
      console.log(this.list);
    },
    methods: {
      handleClick(item, index) {
        console.log(`handleClick`, item, index);
        this.list[index].highlight = true;
        return this.$emit('clickOnSearchResult', item);
      }
    }
  }
</script>

<style lang="stylus" scoped>
    ping_an-orange = #FF6600

    .list
        width 100%
        padding 10px 5px
        min-height 100%
        overflow-y auto
        background-color #f5f7fa

        .item
            width 100%
            overflow hidden
            margin-bottom 10px
            border-radius 4px
            border 1px solid #ebeef5
            background-color #fff
            box-shadow 0 2px 12px 0 rgba(0, 0, 0, .1)
            color #303133

            .header
                display flex
                width 100%
                line-height 40px
                line-height 40px
                font-size 13px
                text-align center

                .hierarchy
                    display flex
                    flex-direction column
                    width 100%
                    overflow hidden
                    text-overflow ellipsis
                    word-break break-all
                    white-space nowrap

                    .db, .table, .field
                        overflow hidden
                        text-overflow ellipsis
                        word-break break-all
                        white-space nowrap

                    .db
                        border-left 10px solid #67C23A
                    .table
                        border-left 10px solid #0277BD
                    .field
                        border-left 10px solid #AD1457

                    .current
                        font-size 14px
                        font-weight bold
                        border-bottom 1px dashed #ebeef5
                        line-height 60px
                        height 60px

            .split-horizion
                display flex

                > div
                    width 50%

            .content
                height 50px
                padding 5px
                line-height 13.333px
                font-size 13.333px
                overflow hidden
                text-overflow ellipsis
                word-break break-all
                white-space nowrap

        .item.highlighted
            border-color ping_an-orange
        .item:hover
            cursor pointer

        .item:last-of-type
            margin-bottom 0
</style>
