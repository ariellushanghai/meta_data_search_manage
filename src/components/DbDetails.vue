<template lang="pug">
    .db-details-container
        .db-info
            el-card(:body-style="{padding:'10px',display: 'flex','justify-content': 'space-between', 'flex-direction': 'column'}")
                .card-header(slot='header')
                    img(:src='icon_db')
                    span 数据库详情
                |
                .entry(v-for='entry in dbInfo', :key='entry.display_name')
                    span.display-name {{entry.display_name + " : "}}
                    span.value {{entry.value}}
            |
            .arrow
                img(:src='icon_arrow_forward')
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
  import API from "@/service/api";
  import icon_db from "@/assets/images/icon_db.png";
  import icon_table from "@/assets/images/icon_table.png";
  import icon_arrow_forward from "@/assets/images/ic_arrow_forward_black_48dp.png";
  import { map, pick } from "lodash";

  export default {
    name: "DbDetails",
    props: ["db_id"],
    data() {
      return {
        icon_db,
        icon_table,
        icon_arrow_forward,
        isLoadingData: false,
        db_info: {},
        table_list: [],
        text_filter_for_tables: "",
        mapping: {
          "name": "库名",
          "tableCnt": "表数量",
          "createTime": "建库时间",
          "dbAdmin": "Hive管理员",
          "sasPermissionAdmin": "SAS权限管理员",
          "modifyTime": "最近更新时间"
        }
      };
    },
    computed: {
      dbInfo() {
        return map(pick(this.db_info, ["name", "tableCnt", "createTime", "dbAdmin", "sasPermissionAdmin", "modifyTime"]),
          (v, k) => {
            return {
              display_name: this.mapping[k],
              value: v
            };
          });
      },
      tableList() {
        return this.table_list.filter((table) => table.tableName.toLowerCase().includes(String(this.text_filter_for_tables).toLowerCase()));
      }
    },
    mounted() {
      console.log(`<DbDetails/> mounted()`);
      this.getHiveById(this.db_id);

    },
    activated: function() {
      console.log(`<DbDetails/> activated()`);
      this.getHiveById(this.db_id);
    },
    deactivated: function() {
      console.log(`<DbDetails/> deactivated()`);
    },
    methods: {
      handleTableListCurrentRowChange(val) {
        console.log(`select_table() val: => `, val);
        return this.$emit("select_table", val.id);
      },
      getHiveById(db_id) {
        console.log(`getHiveById(${db_id})`);
        this.isLoadingData = true;
        return API.getHiveById({ db_id: db_id }).then(res => {
          this.isLoadingData = false;
          this.db_info = res.DB_INFO;
          this.table_list = res.tableList.list;
        }, err => {
          console.error(`err: `, err);
          this.$notify({
            message: `${err}`,
            type: "error",
            duration: 0
          });
          this.isLoadingData = false;
        });
      }
    }
  };
</script>

<style lang="stylus" scoped>
    .db-details-container
        display flex
        align-items start
        width 100%
        height 100%
        overflow hidden
        background-color #f5f7fa

    .db-info, .tables .list
        overflow-x hidden
        overflow-y auto
        padding 0

        /deep/ .el-card__header
            padding 15px 10px
            font-size 14px

            img
                width 14px
                height auto
                display inline-block
                vertical-align text-top
                margin-right .5em

        /deep/ .entry
            display flex
            height 40px
            line-height 40px
            border-bottom 1px dashed #dcdfe6

            .value
                width 67%
                overflow hidden
                text-overflow ellipsis
                white-space nowrap
                word-break break-all
                vertical-align middle
                font-size 13px
                color #29292d

            .display-name
                color #1d1d1b
                font-size 13px
                width 33%
                font-weight bold

        /deep/ .entry:last-of-type
            border-bottom none

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
        width calc(40% + 50px)
        height 100%
        display flex
        align-items start

        .arrow
        display flex
        align-items center

        img
            width 50px
            height auto
            max-height 100%



    .tables
        flex-grow 1
        width auto
        height 100%

        .text-filter
            height 30px

        .list
            height calc(100% - 30px)


</style>
