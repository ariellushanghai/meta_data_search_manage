<template>
    <el-row class="row" type="flex">
        <el-col :sm="logo_cols_small" :md="logo_cols_small" :lg="5" :xl="5" class="title">
            <router-link class="link col" :to="{path: '/'}">
                <img class="logo" :src="small_logo_file"/>
            </router-link>
            <div class="title-text">元数据管理</div>
        </el-col>

        <el-col :sm="15" :md="15" :lg="16" :xl="16">

            <el-menu mode="horizontal" background-color="#333644" text-color="#fff" active-text-color="#FF6600"
                     :default-active="defaultActive" :router="true">
                <el-menu-item v-for="menu in menuItems" :index="'/' + menu.route" :key="menu.route"
                              :disabled="menu.disabled">
                    {{menu.display_name}}
                </el-menu-item>
            </el-menu>

        </el-col>

        <el-col class="col-user" :span="3">
            <el-dropdown @command="handleCommand" placement="bottom">
                <el-button class="btn-user" type="text">{{userName}}<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="logout">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-col>

    </el-row>
</template>

<script>
  // @flow

  import {extend, isNil} from 'lodash'
  import API from '@/service/api'
  // import big_logo_file from '@/assets/images/logo.jpg'
  import small_logo_file from '@/assets/images/logo_ping_an_bank.jpg'

  export default {
    name: 'GlobalHeader',
    data() {
      return {
        // big_logo_file,
        small_logo_file
      }
    },
    computed: {
      defaultActive() {
        if (/^\/meta\//.exec(this.$route.path)) {
          return '/meta'
        }
        return this.$route.path;
      },
      menuItems() {
        // return this.$store.getters.global_menu;
        return [
          {
            display_name: '元数据管理',
            route: 'meta',
            disabled: false
          }, {
            display_name: '辅助分析',
            route: 'assist',
            disabled: false
          }, {
            display_name: '事件管理',
            route: 'event',
            disabled: true
          }, {
            display_name: '权限管理',
            route: 'privilege',
            disabled: true
          }
        ]
      },
      userName() {
        return this.$store.getters.user_name;
      },
      flag_at_meta_page() {
        return this.$store.getters.at_meta_page;
      },
      logo_cols_small() {
        return this.$store.getters.at_meta_page ? 6 : 8
      },
      logo_cols_big() {
        return this.$store.getters.at_meta_page ? 5 : 8
      }
    },
    mounted() {
      // this.fetchMenu();
    },
    methods: {
      fetchMenu() {
        return API.getMenus().then(res => {
          console.log(`fetchMenu() success!!`);
          this.$store.commit('SAVE_USER_INFO', res);
          // return this.$router.push({name: 'index'})
        });
      },
      logOut() {
        return API.logOut().then(res => {
          console.log(`logout success!!`);
          this.$store.commit('LOGOUT');
          return this.$router.replace({name: 'login'})
        });
      },
      handleCommand(command) {
        if (command === 'logout') {
          return this.logOut();
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
    header-height = 60px
    ping_an-orange = #FF6600

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
