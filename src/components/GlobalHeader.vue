<template lang="pug">
    .row
        .title
            router-link.link.col(:to="{path: '/'}")
                img.logo(:src='small_logo_file')
        |
        .title-text(v-show='!flag_show_search_input') 元数据管理
        |
        transition(name="fade")
            .search-input(v-show='flag_show_search_input')
                el-input(placeholder='请输入内容', v-model.trim='inputSearch', @keyup.enter.native="search", size='medium', :clearable='true')
                    el-button(slot='append' type='primary' icon='el-icon-search' size='medium', @click='search')
                        | 搜索
        |
        el-menu.menu(mode='horizontal', background-color='#333644', text-color='#fff', active-text-color='#FF6600', :default-active='defaultActive', :router='true')
            el-menu-item(v-for='menu in menuItems', :index="'/' + menu.route", :key='menu.route', :disabled='menu.disabled')
                | {{menu.display_name}}
        |
        .white-space
        |
        .col-user
            el-dropdown(@command='handleCommand', placement='bottom')
                el-button.btn-user(type='text')
                    | {{userName}}
                    i.el-icon-arrow-down.el-icon--right
                |
                el-dropdown-menu(slot='dropdown')
                    el-dropdown-item(command='logout') 退出

</template>

<script>
  // @flow

  import { extend, isNil } from "lodash";
  import API from "@/service/api";
  import small_logo_file from "@/assets/images/logo_ping_an_bank.jpg";

  export default {
    name: "GlobalHeader",
    data() {
      return {
        small_logo_file,
        flag_show_search_input: false
      };
    },
    computed: {
      defaultActive() {
        if (/^\/meta\//.exec(this.$route.path)) {
          return "/meta";
        }
        return this.$route.path;
      },
      menuItems() {
        return [
          {
            display_name: "元数据管理",
            route: "meta",
            disabled: false
          }, {
            display_name: "辅助分析",
            route: "assist",
            disabled: true
          }, {
            display_name: "事件管理",
            route: "event",
            disabled: true
          }, {
            display_name: "权限管理",
            route: "privilege",
            disabled: true
          }
        ];
      },
      userName() {
        return this.$store.getters.user_name;
      },
      inputSearch() {
        return this.$store.getters.seach_word;
      }
    },
    mounted() {
    },
    watch: {
      "$route"(to, from) {
        console.log(`<GlobalHeader/> watches $route`);
        console.log(`to: `, to, `, from: `, from);
        if (to.name === "meta") {
          this.flag_show_search_input = false;
        } else {
          this.flag_show_search_input = true;
        }
      }
    },
    methods: {
      search() {
        this.$store.commit("SAVE_USER_INPUT_SEARCH", {
          seach_word: this.input_search.trim()
        });
      },
      logOut() {
        return API.logOut().then(res => {
          console.log(`logout success!!`);
          this.$store.commit("LOGOUT");
          return this.$router.replace({ name: "login" });
        });
      },
      handleCommand(command) {
        if (command === "logout") {
          return this.logOut();
        }
      }
    }
  };
</script>

<style lang="stylus" scoped>
    header-height = 60px
    ping_an-orange = #FF6600

    .el-menu-item
        user-select none

    .invisiable
        visibility hidden
        display none
        opacity 0

    .row
        display flex
        height 100%
        background-color #333644
        color #fff

        .menu
            flex-shrink 0

        .white-space
            flex-grow 1

        .col
            height 100%
            background-color #35495e

        .link
            display flex
            justify-content space-around
            align-items center
            background-color ping_an-orange
            user-select none
            width 133px
            height 100%

        .logo
            display block
            flex-grow 0
            flex-shrink 0
            width 100%
            height auto
            max-height header-height

        .title, .title-text
            display flex
            justify-content left
            line-height header-height
            text-align center
            background-color ping_an-orange
            font-size 20px
            font-weight bold
            color #fff
            user-select none

        .title-text
            padding 0 20px
            text-align center
            letter-spacing .1em

        .col-user
            display flex
            align-items center
            justify-content center

    .btn-user
        color #fff

    .btn-user:hover
        color rgb(234, 85, 5)

    .search-input
        display flex
        justify-content center
        align-items center
        padding 0 20px

        /deep/ .el-input
            width 300px
            margin 0 auto

            /deep/ .el-button--primary
                color #fff
                background-color #409EFF
                border 1px solid #409EFF
                border-top-left-radius 0
                border-bottom-left-radius 0

            /deep/ .el-input-group__append
                border 1px solid transparent
                background-color #409eff
</style>
