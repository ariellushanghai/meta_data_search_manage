import network from "@/service/network";

export default {
  // 获取 首页数据
  getIndexData(req) {
    // return network.get("/index.json");
    return network.get("/index");
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
    return network.get("/getSearchResult.json");
  }
};
