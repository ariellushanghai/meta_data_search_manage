export default {
  install(Vue) {
    Vue.filter("sevenCharsMax", function(value) {
      if (value) {
        return value.substring(0, 7);
      } else {
        return "";
      }
    });
  }
};
