/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const getUrl = (url: string): string => `https://localhost:44378${url}`;
// const getUrl = (url: string): string => url;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getConfig = (config: AxiosRequestConfig<any> | undefined): AxiosRequestConfig<any> | undefined => {
  const token = localStorage.getItem("token");
  if (!token) {
    return config;
  }

  let configV = { ...config };

  if (!configV) {
    configV = {
      headers: { Authorization: `Bearer ${token}` },
    };
  } else {
    configV = {
      ...configV,
      headers: { ...configV.headers, Authorization: `Bearer ${token}` },
    };
  }

  return configV;
};

function errorHandler<T>(fn: () => Promise<T>) {
  return fn().catch((err: Error & { response: AxiosResponse | null; isHandled: boolean }) => {
    let msg = "";
    if (err.response) {
      const res = err.response as AxiosResponse;

      // required to skip init auth req
      if (res.status === 401) {
        return null as T;
      }

      if (res.data?.message) {
        // expected message from backend
        msg = res.data.message;
      } else {
        msg = err.message;
        if (res.config.url) {
          msg += ` in ${res.config.method?.toUpperCase()} ${res.config.url}`;
        }
      }
    }

    if (!msg) {
      msg = err.message;
    }

    // eslint-disable-next-line no-param-reassign
    err.isHandled = true;

    // eslint-disable-next-line no-use-before-define, @typescript-eslint/no-use-before-define
    httpService.onError(msg);

    throw err;
  });
}

const httpService = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    errorHandler(() => axios.get<T>(getUrl(url), getConfig(config))),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    errorHandler(() => axios.post<T>(getUrl(url), data, getConfig(config))),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    errorHandler(() => axios.put<T>(getUrl(url), data, getConfig(config))),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    errorHandler(() => axios.delete<T>(getUrl(url), getConfig(config))),

  onError: (errorMsg: string) => {
    console.error("Unhandled httpService errors ", errorMsg);
  },
};

export default httpService;
