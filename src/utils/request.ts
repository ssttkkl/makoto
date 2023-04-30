import { refreshExclusive } from '@/services/auth';
import { getAccessToken, getRefreshToken } from '@/services/auth/token/holder';
import {
  history,
  request as originRequest,
  useRequest as originUseRequest,
} from '@umijs/max';
import { message } from 'antd';

// 异常
export class NoRefreshTokenException extends Error {
  constructor() {
    super('No access token!');
  }
}

// 异常时显示消息
async function onErrorShowMessage<T>(action: () => Promise<T>): Promise<T> {
  try {
    return await action();
  } catch (error: any) {
    // show error message
    if (error.response) {
      message.error(error.response.data.message ?? '未知错误');
    } else {
      message.error('发送请求时出了一点问题');
    }

    throw error;
  }
}

async function on401<T>(action: () => Promise<T>): Promise<Awaited<T>> {
  try {
    return await action();
  } catch (error: any) {
    if (
      error instanceof NoRefreshTokenException ||
      (error.response && error.response.status === 401)
    ) {
      const loc = history.location;
      if (loc.pathname !== '/login') {
        if (await refreshExclusive({ redirectToLoginPageOnFailed: true })) {
          console.log('re-sending request...');
          return await action();
        }
      }
    }

    throw error;
  }
}

// request
export const request: typeof originRequest = async (url, opts: any = {}) => {
  if (opts?.requireToken !== false) {
    if (getRefreshToken() === null) {
      return await on401(() => {
        throw new NoRefreshTokenException();
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

// useRequest
export const useRequest: typeof originUseRequest = (
  service: any,
  options: any = {},
) => {
  return originUseRequest(service, {
    ...options,
    formatResult: (data) => data,
  });
};
