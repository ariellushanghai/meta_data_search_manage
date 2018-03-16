import network from '@/service/network'

export default {
  // 获取菜单
  // getMenus() {
  //   // return network.get('/getUserMenu.json');
  //   return network.get('/user/getMgrMenu.do');
  // },
  // 获取 关键词管理-配置功能服务
  getIndexData(req) {
    return network.get('/index.json');
    // return network.post('/module/getAllApp.do', undefined, {params: req});
  }

}
