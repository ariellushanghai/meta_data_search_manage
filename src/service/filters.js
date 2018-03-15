export default {
  install(Vue) {
    Vue.filter('transStatusToTag', function (value) {
      switch (value) {
        case 'DONE':
          return 'success';
          break;
        case 'RUNNING':
          return '';
          break;
        case 'PENDING':
          return 'warning';
          break;
        case 'ERROR':
          return 'danger';
          break;
        default:
          return '';
          break;
      }
    });
  }
}
