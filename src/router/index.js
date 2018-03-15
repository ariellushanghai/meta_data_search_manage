import Router from 'vue-router'
import store from '@/store/'

// 元数据管理模块
const Meta = r => require(['@/pages/Meta/Meta.vue'], r); // 容器
const MetaIndex = r => require(['@/pages/Meta/Index.vue'], r); // 未搜索时的首页
// 辅助分析模块
const Assist = r => require(['@/pages/Assist/Assist.vue'], r);
// 事件管理模块
// 权限管理模块


const router = new Router({
  routes: [
    {
      name: 'index',
      redirect: {
        path: '/meta'
      },
      path: '/'
    },
    {
      path: '/meta',
      component: Meta,
      children: [
        {
          path: '',
          component: MetaIndex
        }
      ]
    },
    {
      name: 'assist',
      path: '/assist',
      component: Assist
    }
  ]
});

// router.beforeEach((to, from, next) => {
//   console.log(`router.beforeEach(to: `, to, ` from: `, from);
//   return next();
//   // this.$store.commit('ENTER_META_PAGE');
//   // if (store.getters.user_name) {
//   //   return next();
//   // } else {
//   //   return next({
//   //     name: 'login'
//   //   });
//   // }
// });

// router.afterEach((to, from) => {
//   console.log(`router.afterEach(to: `, to, ` from: `, from);
//   // this.$store.commit('ENTER_META_PAGE');
//   // if (store.getters.user_name) {
//   //   return next();
//   // } else {
//   //   return next({
//   //     name: 'login'
//   //   });
//   // }
// })

export default router