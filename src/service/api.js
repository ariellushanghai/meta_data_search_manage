import network from '@/service/network'

export default {
  // 获取菜单
  getMenus() {
    // return network.get('/getUserMenu.json');
    return network.get('/user/getMgrMenu.do');
  },
  // 获取 关键词管理-配置功能服务
  getAllApp(req) {
    // return network.get('/getAllApp.json');
    return network.post('/module/getAllApp.do', undefined, {params: req});
  },
  // 更新 关键词-配置功能服务
  updateKeyWord(req) {
    // return network.get('/getAllApp.json');
    return network.post('/module/updateKeyWord.do', undefined, {params: req});
  },
  // 关键词管理-配置功能服务-表格导出为csv格式
  exportCSV(req) {
    // return network.get('/getAllApp.json');
    return network.post('/module/appImport.do', undefined, {params: req});
  },
  // 关键词管理-配置功能服务-表格导出为csv格式
  getVersion(req) {
    // return network.get('/getVersion.json');
    return network.post('/module/getVersion.do', undefined, {params: req});
  },

}
