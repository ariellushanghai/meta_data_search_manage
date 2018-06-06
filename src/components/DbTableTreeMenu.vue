<template lang="pug">
    .db-table-tree-menu
        .dbs
            el-table#table_dbs(ref="hiveList", :data='hives.list', row-key='id', @current-change='handleSelectHive', :empty-text='hives.placeholder_of_empty_list', v-loading='hives.is_loading', :row-class-name='setHiveRowClassName', height='100%', :fit='true', :highlight-current-row='true', :show-header='false', size='mini')
                el-table-column(:show-overflow-tooltip='true')
                    template(slot-scope='scope')
                        img(:src='hives.icon', title='库')
                        span(style='font-size: 14px;') {{scope.row.name}}
        |
        .tables
            .filter-bar
                .blur-mask
                .text-filter
                    div(v-show="tables.list.length !== 0")
                        span 共
                        span.num {{tables.list.length}}
                        span 张表，过滤：
                    el-input(placeholder='请输入表名', v-model.trim='tables.name_filter', :clearable='true', :fit='true', size='mini')
                        img(slot='prefix')
                |
            .list
                el-table#table_tables(:data='tableList', @current-change='handleSelectTable', :empty-text='tables.placeholder_of_empty_list', v-loading='tables.is_loading', height='100%', :fit='true', :highlight-current-row='true', :show-header='false', size='mini')
                    el-table-column(:show-overflow-tooltip='true')
                        template(slot-scope='scope')
                            img(:src='tables.icon', title='表')
                            span(style='font-size: 14px;') {{scope.row.tableName}}

</template>

<script>
  import API from "@/service/api";
  import icon_db from "@/assets/images/icon_db.png";
  import icon_table from "@/assets/images/icon_table.png";
  import { isEmpty, find } from "lodash";

  export default {
    name: "DbTableTreeMenu",
    props: ["db_id"],
    data() {
      return {
        hives: {
          icon: icon_db,
          is_loading: false,
          list: [],
          placeholder_of_empty_list: "暂无数据",
          selected: null
        },
        tables: {
          icon: icon_table,
          is_loading: false,
          list: [],
          placeholder_of_empty_list: "←请选择Hive库",
          name_filter: ""
        }
      };
    },
    computed: {
      tableList() {
        return this.tables.list.filter(table => table.tableName.toLowerCase().includes(String(this.tables.name_filter).toLowerCase()));
      }
    },
    watch: {
      db_id(id) {
        // debugger;
        console.log(`<DbTableTreeMenu/>.watch: db_id changed: ${id}`);
        if (id && `${id}`.length > 0) {
          return this.watchHandlerSelectHive(`${id}`);
        }
      }
    },
    created() {
      console.log(`<DbTableTreeMenu/> created, this.db_id: ${this.db_id}`);
      this.getHiveList();
    },
    methods: {
      setUpUI() {
        console.log(`setUpUI with `, this.db_id);
        this.hives.selected = find(this.hives.list, (hive) => {
          return hive.id === this.db_id;
        });
        console.log(`setUpUI() => seleted hive: `, this.hives.selected);
        if (this.db_id && `${this.db_id}`.length > 0) {
          console.log(`DOM operation`);
          this.$refs.hiveList.setCurrentRow(this.hives.selected);
        }
      },
      getHiveList() {
        console.log("<DbTableTreeMenu/>.getHiveList()");
        this.hives.is_loading = true;
        API.getHiveList({}).then(res => {
          this.hives.is_loading = false;
          this.hives.list = res.dbList;
          this.$nextTick(() => {
            this.setUpUI();
          });
        }, err => {
          console.error(`err: `, err.errmsg);
          this.$notify({
            message: `${err.errmsg}`,
            type: "error",
            duration: 0
          });
          this.hives.is_loading = false;
        });
      },
      handleSelectHive(val, oldVal) {
        console.log(`handleSelectHive() val: => `, val, `, oldVal: => `, oldVal);

        if (this.tables.is_loading || isEmpty(val) || `${val.id}`.length === 0) {
          return false;
        }
        if (!oldVal) {
          //  对应组件首次创建
          return this.watchHandlerSelectHive(`${val.id}`);
        }
        if (`${val.id}` !== `${oldVal.id}`) {
          // 对应用户选择hive，直接跳路由
          return this.$emit("select_hive", val.id);
        }

        // this.hives.selected = val;
        // this.tables.name_filter = "";
        // return this.getHiveById(val.id);
      },
      watchHandlerSelectHive(db_id) {
        console.log(`watchHandlerSelectHive(${db_id})`);
        db_id && (`${db_id}`.length > 0) && this.scrollToSelectedHive(db_id);
        // this.hives.selected = val;
        this.tables.name_filter = "";
        return this.getHiveById(db_id);
      },
      setHiveRowClassName({ row }) {
        // console.log(`setHiveRowClassName(row: `, row, `)`);
        return `hive-row-id-${row.id}`;
      },
      scrollToSelectedHive(db_id) {
        console.log(document.querySelector(`.hive-row-id-${db_id}`));
        let $table = document.querySelector("#table_dbs .el-table__body-wrapper");
        let $selected_hive = document.querySelector(`.hive-row-id-${db_id}`);
        if ($table && $selected_hive) {
          return this.$nextTick(() => {
            $table.scrollTop = $selected_hive.offsetTop - ($table.clientHeight / 2);
          });
        }
      },
      handleSelectTable(val) {
        console.log(`handleSelectTable() val: => `, val);
        if (this.tables.is_loading) {
          return false;
        }
        if (!val) {
          return false;
        }
        return this.$emit("select_table", val.id);
      },
      getHiveById(db_id) {
        console.log(`<DbTableTreeMenu/>.getHiveById(${db_id})`);
        if (Number(db_id) === 0) {
          return false;
        }
        this.tables.is_loading = true;
        this.tables.list = [];
        this.tables.placeholder_of_empty_list = "正在获取数据";
        this.$emit("select_table", null);

        return API.getHiveById(db_id).then(res => {
          this.tables.is_loading = false;
          this.tables.list = res.tableList.list;
          if (isEmpty(this.tables.list)) {
            this.tables.placeholder_of_empty_list = "暂无数据";
          } else {
            this.tables.placeholder_of_empty_list = "←请选择Hive库";
          }
        }, err => {
          console.error(`err: `, err.errmsg);
          this.$notify({
            message: `${err.errmsg}`,
            type: "error",
            duration: 0
          });
          this.tables.is_loading = false;
        });
      }
    }
  };
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

            .el-table__body tr:hover
                cursor pointer

            .el-table__body tr.current-row:hover
                cursor default

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

    .dbs
        width 40%
        height 100%

    .tables
        flex-grow 1
        width auto
        height 100%

        .text-filter
            background-color rgba(255, 255, 255, 0.95)
            color #909399
            height 30px
            padding 0 10px
            display flex

            /deep/ .el-input__inner
                padding-left 10px
                padding-right 10px

            > div
                font-size 13px
                line-height 30px
                max-width 55%
                overflow hidden

                span.num
                    color #f60

            > .el-input
                width auto

        .list
            height calc(100% - 30px)

</style>
