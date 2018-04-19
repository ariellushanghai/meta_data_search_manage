let redirectURL
  , loginURL
  , baseURL
  , redirect_uri = encodeURIComponent(location.origin + "");

console.log(`process.env.NODE_ENV: ${process.env.NODE_ENV}`);

if (process.env.NODE_ENV === "development") {
  redirectURL = "http://10.14.220.124:8080/cm/login.html?redirectUrl=" + redirect_uri + "";
  loginURL = "http://10.14.220.124:8080/cm/login.html?redirectUrl=";
  // baseURL = 'http://localhost:8080/static/mock_json/'
  baseURL = "http://localhost:8080/api";
  // baseURL = 'http://localhost:8080'
} else {
  // redirectURL = "http://bip.pab.com.cn/cm/login.html?redirectUrl=" + redirect_uri + "";
  // loginURL = "http://bip.pab.com.cn/cm/login.html?redirectUrl=";
  redirectURL = "http://10.14.220.124:8080/cm/login.html?redirectUrl=" + redirect_uri + "";
  loginURL = "http://10.14.220.124:8080/cm/login.html?redirectUrl=";
  baseURL = "http://10.14.224.180:9090/api";
}

export { redirectURL, loginURL, baseURL };
