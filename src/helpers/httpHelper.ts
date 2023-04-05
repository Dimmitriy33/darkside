/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

// const getUrl = (url: string): string => `http://localhost:40553${url}`;
const getUrl = (url: string): string => url;

function errorHandler<T>(fn: () => Promise<T>) {
  return fn().catch((err: Error & { response: AxiosResponse | null; isHandled: boolean }) => {
    let msg = "";
    if (err.response) {
      const res = err.response as AxiosResponse;
      if (res.data?.errorMessage) {
        // expected message from backend
        msg = res.data.errorMessage;
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
  get: <T>(url: string, config?: AxiosRequestConfig) => errorHandler(() => axios.get<T>(getUrl(url), config)),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    errorHandler(() => axios.post<T>(getUrl(url), data, config)),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    errorHandler(() => axios.put<T>(getUrl(url), data, config)),

  delete: <T>(url: string, config?: AxiosRequestConfig) => errorHandler(() => axios.delete<T>(getUrl(url), config)),

  onError: (errorMsg: string) => {
    console.error("Unhandled httpService errors ", errorMsg);
  },
};

export default httpService;
