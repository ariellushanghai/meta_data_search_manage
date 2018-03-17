import network from '@/service/network'

export default {
  // 获取 首页数据
  getIndexData(req) {
    return network.get('/index.json');
  },
  // 获取Hive DB列表
  getHiveDBList() {
    return network.get('/hiveDbList.json');
  },
  // 获取DB对应表格列表
  fetchTablesByDbId() {
    return network.get('/fetchTablesByDbId.json');
  }

}
