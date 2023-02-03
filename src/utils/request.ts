import { refresh } from '@/services/auth';
import { getAccessToken, getRefreshToken } from '@/services/auth/token';
import { AxiosRequestConfig } from '@umijs/max';
import { AxiosResponse } from '@umijs/max';
import { history, request as originRequest } from '@umijs/max';
import { message } from 'antd';
import { Mutex } from 'async-mutex';

// copied from @umijs/max

// request 方法 opts 参数的接口
interface IRequestOptions extends AxiosRequestConfig {
  requireToken?: boolean;
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

// 异常
export class NoAccessTokenException extends Error {
  constructor() {
    super('No access token!');
  }
}

// 异常时显示消息
function onErrorShowMessage<T>(
  action: () => Promise<T>,
  rethrow?: true,
): Promise<T>;
function onErrorShowMessage<T>(
  action: () => Promise<T>,
  rethrow?: false,
): Promise<T | undefined>;

async function onErrorShowMessage<T>(
  action: () => Promise<T>,
  rethrow?: boolean,
): Promise<T | undefined> {
  try {
    return await action();
  } catch (error: any) {
    // show error message
    if (error.response) {
      message.error(error.response.data.message ?? '未知错误');
    } else {
      message.error('发送请求时出了一点问题');
    }

    if (rethrow === true) {
      throw error;
    }
  }
}

// handle 401 or no token
const refreshMutex = new Mutex();

async function refreshExclusive(): Promise<boolean> {
  const accToken = getAccessToken();
  return await refreshMutex.runExclusive(async () => {
    // 获取到锁后，判断token是否已经被之前的请求刷新
    const curAccToken = getAccessToken();
    return accToken !== curAccToken || (await refresh());
  });
}

async function on401<T>(action: () => Promise<T>): Promise<Awaited<T>> {
  try {
    return await action();
  } catch (error) {
    const loc = history.location;
    if (loc.pathname !== '/login') {
      if (await refreshExclusive()) {
        console.log('re-sending request...');
        return await action();
      } else {
        console.log('no token, redirecting to login page...');
        history.push('/login?redirect=' + loc.pathname);
      }
    }

    throw error;
  }
}

// request
export const request: IRequest = async (url, opts: any = {}) => {
  if (opts?.requireToken ?? true) {
    if (getRefreshToken() === null) {
      return await on401(() => {
        throw new NoAccessTokenException();
      });
    } else if (getAccessToken() === null) {
      await refreshExclusive();
    }

    opts.headers = {
      Authorization: 'Bearer ' + getAccessToken(),
      ...opts.headers,
    };
  }

  console.debug('request: ', url, opts);

  const { getResponse } = opts;

  return await onErrorShowMessage(async () => {
    return await on401(async () => {
      const resp = await originRequest(url, { ...opts, getResponse: true });
      console.debug('response: ', resp, 'of request', url, opts);
      return Promise.resolve(getResponse ? resp : resp.data);
    });
  });
};
