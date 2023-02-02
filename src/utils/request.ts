import { refresh } from '@/services/auth';
import { getAccessToken } from '@/services/auth/token';
import { AxiosRequestConfig } from '@umijs/max';
import { AxiosResponse } from '@umijs/max';
import { history, request as originRequest } from '@umijs/max';
import { message } from 'antd';
import { Mutex } from 'async-mutex';

// request 方法 opts 参数的接口
interface IRequestOptions extends AxiosRequestConfig {
  skipErrorHandler?: boolean;
  requestInterceptors?: IRequestInterceptorTuple[];
  responseInterceptors?: IResponseInterceptorTuple[];
  [key: string]: any;
}

interface IRequestOptionsWithResponse extends IRequestOptions {
  getResponse: true;
}

interface IRequestOptionsWithoutResponse extends IRequestOptions {
  getResponse: false;
}
interface IRequest {
  <T = any>(url: string, opts: IRequestOptionsWithResponse): Promise<
    AxiosResponse<T>
  >;
  <T = any>(url: string, opts: IRequestOptionsWithoutResponse): Promise<T>;
  <T = any>(url: string, opts: IRequestOptions): Promise<T>; // getResponse 默认是 false， 因此不提供该参数时，只返回 data
  <T = any>(url: string): Promise<T>; // 不提供 opts 时，默认使用 'GET' method，并且默认返回 data
}

type IRequestInterceptorAxios = (config: IRequestOptions) => IRequestOptions;
type IRequestInterceptorUmiRequest = (
  url: string,
  config: IRequestOptions,
) => { url: string; options: IRequestOptions };
type IRequestInterceptor =
  | IRequestInterceptorAxios
  | IRequestInterceptorUmiRequest;
type IErrorInterceptor = (error: Error) => Promise<Error>;
type IResponseInterceptor = <T = any>(
  response: AxiosResponse<T>,
) => AxiosResponse<T>;
type IRequestInterceptorTuple =
  | [IRequestInterceptor, IErrorInterceptor]
  | [IRequestInterceptor]
  | IRequestInterceptor;
type IResponseInterceptorTuple =
  | [IResponseInterceptor, IErrorInterceptor]
  | [IResponseInterceptor]
  | IResponseInterceptor;

const refreshMutex = new Mutex();

export const request: IRequest = async (url, opts: any = {}) => {
  // add token
  const accToken = getAccessToken();
  if (accToken) {
    opts.headers = {
      Authorization: 'Bearer ' + accToken,
      ...opts.headers,
    };
  }

  console.debug('request: ', url, opts);

  const { getResponse } = opts;

  try {
    const resp = await originRequest(url, { ...opts, getResponse: true });
    console.debug('response: ', resp, 'of request', url, opts);
    if (getResponse) {
      return resp;
    } else {
      return resp.data;
    }
  } catch (error: any) {
    // handle 401
    const loc = history.location;
    if (
      error.response &&
      error.response.status === 401 &&
      loc.pathname !== '/login'
    ) {
      await refreshMutex.acquire();
      try {
        // 获取到锁之后，检查AccessToken是否已经被刷新
        const curAccToken = getAccessToken();
        const refreshed = accToken !== curAccToken || (await refresh());
        if (refreshed) {
          console.log('re-sending request...');
          return await request(url, opts);
        } else {
          console.log('no token, redirecting to login page...');
          message.error('请先登录');

          history.push('/login?redirect=' + loc.pathname);
          return;
        }
      } finally {
        refreshMutex.release();
      }
    }

    console.error('error: ', error, 'of request', url, opts);

    // show error message
    if (error.response) {
      message.error(error.response.data.message ?? '未知错误');
    } else {
      message.error('发送请求时出了一点问题');
    }
    throw error;
  }
};
