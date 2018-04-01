<template lang="pug">
    el-row.row(type='flex')
        el-col.title(:sm='logo_cols_small', :md='logo_cols_small', :lg='5', :xl='5')
            router-link.link.col(:to="{path: '/'}")
                img.logo(:src='small_logo_file')
            |
            .title-text 元数据管理
        |
        el-col(:sm='15', :md='15', :lg='16', :xl='16')
            el-menu(mode='horizontal', background-color='#333644', text-color='#fff', active-text-color='#FF6600', :default-active='defaultActive', :router='true')
                el-menu-item(v-for='menu in menuItems', :index="'/' + menu.route", :key='menu.route', :disabled='menu.disabled')
                    | {{menu.display_name}}
        |
        el-col.col-user(:span='3')
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
  // import big_logo_file from '@/assets/images/logo.jpg'
  import small_logo_file from "@/assets/images/logo_ping_an_bank.jpg";

  export default {
    name: "GlobalHeader",
    data() {
      return {
        // big_logo_file,
        small_logo_file
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
      logo_cols_small() {
        return this.$store.getters.at_meta_page ? 6 : 8;
      },
      logo_cols_big() {
        return this.$store.getters.at_meta_page ? 5 : 8;
      }
    },
    mounted() {
    },
    watch: {
      "$route"(to, from) {
        console.log(`<GlobalHeader/> watches $route`);
        console.log(`to: `, to, `, from: `, from);
        if (to.name === "meta") {

        }
      }
    },
    methods: {
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
        height 100%
        background-color #333644
        color #fff

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

    .title
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
        flex-grow 1
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

</style>
