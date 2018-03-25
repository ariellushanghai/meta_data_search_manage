<template lang="pug">
    .list(v-if='dataResult')
        .item(v-for='item in dataResult', @click="handleClick(item)")
            .header
                .hierarchy(v-if='item.type === "db"')
                    .db.current 库
                .hierarchy(v-if='item.type === "table"')
                    .table.current 表
                    el-tooltip(:content='item.dbName', effect="light", placement='top')
                        .db 库
                .hierarchy(v-if='item.type === "field"')
                    .field.current 字段
                    el-tooltip(:content='item.tableName', effect="light", placement='top')
                        .table 表
                    el-tooltip(:content='item.dbName', effect="light", placement='top')
                        .db 库

                .name {{item.name}}

            .content {{item.descr}}

</template>

<script>
  // @flow

  import {isEmpty} from 'lodash'

  export default {
    name: 'ResultItem',
    props: ['list'],
    data() {
      return {}
    },
    computed: {
      dataResult() {
        if (isEmpty(this.list)) {
          return false
        }
        return this.list
      }
    },
    mounted() {
      console.log(this.list);
    },
    methods: {
      handleClick(item) {
        console.log(`handleClick`, item);
      }
    }
  }
</script>

<style lang="stylus" scoped>
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
                height 50px
                line-height 50px
                font-size 13px
                text-align center

                .hierarchy
                    display flex
                    align-items stretch
                    width 50%
                    height 100%
                    color white

                    .db
                        flex-grow 1
                        background-color #F9A825
                    .table
                        flex-grow 1
                        background-color #0277BD
                    .field
                        flex-grow 1
                        background-color #AD1457

                    .current
                        flex-grow 2
                        font-size 14px
                        font-weight bold
                .name
                    width 50%
                    overflow hidden
                    text-overflow ellipsis
                    word-break break-all
                    white-space nowrap
                    padding 0 .5em
                    border-bottom 1px dashed #ebeef5

            .content
                height 50px
                padding 5px
                line-height 13.333px
                font-size 13.333px
                overflow hidden
                text-overflow ellipsis
                word-break break-all
                white-space nowrap

        .item:hover
            cursor pointer

        .item:last-of-type
            margin-bottom 0
</style>
