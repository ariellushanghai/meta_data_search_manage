import network from '@/service/network'

export default {
  // 获取 首页数据
  getIndexData(req) {
    return network.get('/index.json');
  },
  // 获取Hive DB列表
  getHiveDBList() {
    return network.get('/hiveList.json');
  },
  // 获取DB对应表格列表
  getHiveDbById() {
    return network.get('/byHiveDb.json');
  },
  // 获取表格信息(字段)
  getTableById(id) {
    return network.get('/byHiveTable.json');
  }

}
