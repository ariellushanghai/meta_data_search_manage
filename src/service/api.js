import network from "@/service/network";

export default {
  logOut(params) {
    return network.get("/logout", { params });
  },
  // 获取 首页数据
  getIndexData(params) {
    // return network.get("/index.json");
    return network.get("/index", { params });
  },
  // 获取Hive DB列表
  getHiveList() {
    // return network.get("/hiveList.json");
    return network.get("/search/hiveList");
  },
  // 获取Hive库详情
  getHiveById(db_id) {
    // return network.get("/byHiveDb.json", {
    //   params: { dbId: db_id }
    // });
    return network.get("/search/hiveTablePage", {
      params: { dbId: db_id }
    });
  },
  // 获取表格详情
  getTableById(table_id) {
    // return network.get("/byHiveTable.json");
    return network.get("/search/hiveFieldPage", {
      params: { tableId: table_id }
    });
  },
  // 获取 搜索结果
  getSearchResult(req) {
    return network.get("/search/keyword", {
      params: req
    });
  },
  // 获取 表变更历史
  getTableHistory(req) {
    return network.get("/search/tableHistory", {
      params: req
    });
  },
  // 更新 表格的标签
  updateTableTags(obj) {
    return network.post("/search/updateTableTags", undefined, { params: obj });
  },
  // 更新 表格的字段
  updateField(obj) {
    return network.post("/search/updateField", undefined, { params: obj });
  }
};
