import axios from 'axios'


export function getLocalAccessToken() {
  const accessToken = window.localStorage.getItem("accessToken");
  return accessToken;
}
export function getLocalRefreshToken() {
  const refreshToken = window.localStorage.getItem("refreshToken");
  return refreshToken;
}


export const instance = axios.create({
  baseURL: 'http://localhost:3000/',
  // withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

export function refreshToken() {
  return instance.post("/account/refreshtoken", {
    refreshToken: getLocalRefreshToken(),
  }).then((response) => {
    return response;
  },
  (error) => {
    const message =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();
    if(message.includes("new signin request")) {
      // console.log("in new signin request")
      window.localStorage.removeItem("accessToken");
      window.localStorage.removeItem("refreshToken");
      window.localStorage.removeItem("email");
      instance.defaults.headers.common["x-access-token"] = ''
      // reload window
      window.location.reload();     
    }
    return error.data
  }
  );

}

instance.interceptors.request.use(
  (config) => {
    const token = getLocalAccessToken();
    if (token) {
      config.headers["x-access-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    if (err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          const rs = await refreshToken();
          const { accessToken } = rs.data;
          window.localStorage.setItem("accessToken", accessToken);
          instance.defaults.headers.common["x-access-token"] = accessToken;
          return instance(originalConfig);
        } catch (_error) {
          if (_error.response && _error.response.data) {
            return Promise.reject(_error.response.data);
          }
          return Promise.reject(_error);
        }
      }
      if (err.response.status === 403 && err.response.data) {
        return Promise.reject(err.response.data);
      }
    }
    return Promise.reject(err);
  }
);





