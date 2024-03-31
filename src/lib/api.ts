import axios from "axios";
import Cookies from "js-cookie";

export const baseURL = process.env.REACT_APP_DB_HOST;

const api = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json; charset=utf-8",
  },
});

//Request Interceptors
api.interceptors.request.use(
  (config: any) => {
    const token = Cookies.get("access_token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

const unauthorize_responses = ["Unauthorized", ""];

//Response Interceptors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalConfig = error.config;
    const accessToken = Cookies.get("access_token");
    if (error.response) {
      if (
        accessToken &&
        error.response.data.statusCode === 401 &&
        unauthorize_responses.includes(error.response.data.message) &&
        !originalConfig._retry
      ) {
        originalConfig._retry = true;
        try {
          const response = await axios.post("/auth/logout", {
            jwtToken: accessToken,
          });
          Cookies.remove("access_token");
          Cookies.remove("is_signed");
          // window.location.pathname = "/"
          // store.dispatch(setSessionExpiry(true));
        } catch (error) {
          Cookies.remove("access_token");
          Cookies.remove("is_signed");
          // store.dispatch(setSessionExpiry(true));
          // window.location.pathname = "/"
          return null;
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
