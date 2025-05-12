import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { addPending, removePending } from "./cancel";
import { Toast } from 'antd-mobile'
const rq = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "content-type": "application/json;charset=utf-8",
  },
  withCredentials: true
});

rq.interceptors.request.use((config: AxiosRequestConfig) => {
  // 这里可以放入token / header的必要参数
  // config.headers.authorization = window.localStorage.getItem('authorization')
  addPending(config);
  return config;
});

interface IAxiosResponse extends AxiosResponse{
  code: number
}

rq.interceptors.response.use(
  (res: IAxiosResponse) => {
    removePending(res);
    switch(res.data.code) {
      case 200:
        return res.data as any
      case 500:
        Toast.show(res.data.msg)
        return false
      default: 
        Toast.show(res.data.msg)
    }
  },
  (err) => {
    if (!axios.isCancel(err)) {
      console.error(err);
    }
  }
);
const http = {
  get(url: string) {
    return rq({
      url,
      method: "GET",
    });
  },
  
  post(url: string, params: any) {
    return rq({
      url,
      method: "POST",
      data: params,
    });
  },
};
export { http };


