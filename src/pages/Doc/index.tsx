import { useSearchParams } from '@umijs/max';
import { HocuspocusProvider } from '@hocuspocus/provider';
import React from 'react';
import { useEffect, useMemo } from 'react';
import { HOCUSPOCUS_ENDPOINT_URL } from '../../config';
import Editor from '@/components/Editor';
import { useModel } from '@umijs/max';
import { mergePath, splitPath } from '@/utils/path';
import { Spin } from 'antd';
import { getAccessToken } from '@/services/auth/token';
import { refreshExclusive } from '@/services/auth';

const Doc: React.FC<{
  name: string;
  params: any;
  writeable: boolean;
}> = ({ name, params, writeable }) => {
  const provider = useMemo(() => {
    const p = new HocuspocusProvider({
      url: HOCUSPOCUS_ENDPOINT_URL,
      name: name,
      parameters: {
        ...params,
        path: mergePath(params.path),
        writeable: writeable,
      },
      token: async () => {
        let acc = getAccessToken();
        if (acc === null) {
          await refreshExclusive({ redirectToLoginPageOnFailed: true });
          acc = getAccessToken();
        }
        return acc ?? '';
      },
    });

    p.on('authenticationFailed', () => {
      (async () => {
        await refreshExclusive();
        await p.connect();
      })().catch(console.error);
    });

    return p;
  }, [name, params, writeable]);

  return <Editor provider={provider} writeable={writeable} />;
};

const DocPage: React.FC = () => {
  const model = useModel('Doc.model');

  // 在从别的页面切换回来时刷新数据
  useEffect(() => {
    model.refresh();
  }, []);

  // 将参数单向同步到model里
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const rawFrom = searchParams.get('from');
    const rawPath = searchParams.get('path');
    const rawShareId = searchParams.get('shareId');
    model.updateParams({
      from: rawFrom === 'share' ? 'share' : 'space',
      path: splitPath(rawPath ?? ''),
      shareId: rawShareId !== null ? Number.parseInt(rawShareId) : undefined,
    });
  }, [searchParams]);

  if (model.error) {
    return <div>{model.error.message}</div>;
  }

  return (
    <Spin spinning={model.loading}>
      {model.unrefFile?.fid ? (
        <Doc
          name={model.unrefFile.fid.toString()}
          params={model.params}
          writeable={model.writeable}
        />
      ) : null}
    </Spin>
  );
};

export default DocPage;
