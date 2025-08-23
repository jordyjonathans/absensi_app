import { message } from 'antd';
import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import qs from 'qs';
import { getLoginInfo, removeLoginInfo } from '../store/local';
import { getUUId } from '../utils/utils';
import { BaseResponse } from '../store/types/baseType';

const httpService = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 2 * 60 * 1000,
  headers: {
    Accept: 'application/json',
    'content-type': 'application/json',
  },
});

httpService.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (config.params) {
      for (const item in config.params) {
        if (item === null) {
          delete config.params[item];
        }
      }
    }
    if (config && config.headers) {
      const loginToken = getLoginInfo()?.token || '';
      if (loginToken) {
        config.headers.authorization = `Bearer ${loginToken}`;
      }
      config.headers['X-KT-Request-Id'] = getUUId();
      config.headers['X-KT-Timestamp'] = new Date().getTime().toString();
      config.headers['X-KT-Debug'] = '0';
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

httpService.interceptors.response.use(
  (response: AxiosResponse<BaseResponse<any>>) => {
    switch (response.status) {
      case 200:
      case 201:
      case 204:
        return response;
    }
    message.error(response.data.message);
    return Promise.reject(new Error(response.data.message));
  },
  error => {
    const status = error.response?.status;
    const data = error.response?.data;
    if (status === 400) {
      message.error(data.message);
    } else if (status === 401) {
      removeLoginInfo();
      message.error(data.message);
      window.location.href = `${window.location.origin}`;
      return Promise.reject(data.message);
    }
    return Promise.reject(data.message);
  }
);

const httpRequest = {
  get<T>(url: string, params = {}): Promise<T> {
    const options: AxiosRequestConfig = {
      url: url,
      method: 'GET',
      params: params,
      responseType: 'json',
    };
    return new Promise((resolve, reject) => {
      httpService(options)
        .then((res: AxiosResponse<BaseResponse<T>>) => {
          return resolve(res.data.data);
        })
        .catch(err => {
          return reject(err);
        });
    });
  },
  post<T>(url: string, params = {}, data = {}): Promise<T> {
    const options: AxiosRequestConfig = {
      url: url,
      method: 'POST',
      params: params,
      data,
      responseType: 'json',
    };

    return new Promise((resolve, reject) => {
      httpService(options)
        .then((res: AxiosResponse<BaseResponse<T>>) => {
          return resolve(res.data.data);
        })
        .catch(err => {
          return reject(err);
        });
    });
  },
  put<T>(url: string, params = {}, data: {} | FormData): Promise<T> {
    const isFormData = data instanceof FormData;

    const options: AxiosRequestConfig = {
      url: url,
      method: 'PUT',
      params: params,
      data,
      responseType: 'json',
      headers: isFormData
        ? { 'Content-Type': 'multipart/form-data' }
        : { 'Content-Type': 'application/json' },
    };

    return new Promise((resolve, reject) => {
      httpService(options)
        .then((res: AxiosResponse<BaseResponse<T>>) => {
          return resolve(res.data.data);
        })
        .catch(err => {
          return reject(err);
        });
    });
  },
  postFile<T>(url: string, params = {}): Promise<T> {
    const options: AxiosRequestConfig = {
      url: url,
      method: 'POST',
      data: qs.stringify(params),
      responseType: 'json',
    };
    return new Promise((resolve, reject) => {
      httpService(options)
        .then((res: AxiosResponse<BaseResponse<T>>) => {
          return resolve(res.data.data);
        })
        .catch(err => {
          return reject(err);
        });
    });
  },
};

export default httpRequest;
