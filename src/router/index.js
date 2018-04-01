import Router from "vue-router";
import store from "@/store/";

// 元数据管理模块
const Meta = r => require(["@/pages/Meta/Meta.vue"], r); // 容器
const MetaIndex = r => require(["@/pages/Meta/Index.vue"], r); // 未搜索时的首页
const SearchResult = r => require(["@/pages/Meta/SearchResult.vue"], r); // 文本搜索
const BlankSearchResult = r => require(["@/pages/Meta/BlankSearchResult.vue"], r); // 搜索未匹配
// 辅助分析模块
const Assist = r => require(["@/pages/Assist/Assist.vue"], r);
// 事件管理模块
// 权限管理模块


const router = new Router({
  routes: [
    {
      name: "index",
      redirect: {
        path: "/meta"
      },
      path: "/"
    },
    {
      path: "/meta",
      component: Meta,
      children: [
        {
          name: "meta",
          path: "",
          component: MetaIndex
        },
        {
          name: "blanksearchresult",
          path: "blank_search/:db",
          component: BlankSearchResult
        },
        {
          name: "searchresult",
          path: "search/",
          component: SearchResult
        }
      ]
    },
    {
      name: "assist",
      path: "/assist",
      component: Assist
    }
  ]
});

export default router;