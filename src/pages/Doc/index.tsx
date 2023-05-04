import { useModel, useSearchParams } from '@umijs/max';
import { HocuspocusProvider } from '@hocuspocus/provider';
import React, { useContext, useEffect, useMemo } from 'react';
import Editor from '@/components/Editor';
import { mergePath, splitPath } from '@/utils/path';
import { Space, Spin } from 'antd';
import { getAccessToken } from '@/services/auth/token';
import { refreshExclusive } from '@/services/auth';
import { SpaceBreadcrumb } from '@/components/SpaceBreadcrumb';
import { ShareBreadcrumb } from '@/components/ShareBreadcrumb';
import { EditorPluginGroup } from '@/components/Editor/plugins/types';
import ChatPlugin from '@/pages/Doc/plugins/chat';
import { OnlinePlugin } from '@/pages/Doc/plugins/online';
import { UserStatesPlugin } from '@/pages/Doc/plugins/user-states';
import { DocFrom } from './types';

const Doc: React.FC<{
  name: string;
  docFrom: DocFrom;
  writeable: boolean;
}> = ({ name, docFrom, writeable }) => {
  const url =
    process.env.NODE_ENV === 'development'
      ? DEV_HOCUSPOCUS_ENDPOINT
      : `ws://${location.hostname}:${location.port}/hocuspocus`;

  const provider = useMemo(() => {
    const params: Record<string, string> = {
      writeable: writeable.toString(),
    };

    if (docFrom.from === 'share') {
      params.from = 'share';
      params.shareId = docFrom.shareId.toString();
      params.path = mergePath(docFrom.path);
    } else {
      params.from = 'space';
      params.path = mergePath(docFrom.path);
    }

    const p = new HocuspocusProvider({
      url,
      name,
      parameters: params,
      token: () => getAccessToken() ?? '',
    });

    p.on('authenticationFailed', () => {
      (async () => {
        await refreshExclusive();
        await p.connect();
      })().catch(console.error);
    });

    console.log(
      'a new provider was created. name: ',
      name,
      ', params: ',
      params,
      ', writeable: ',
      writeable,
      ', url: ',
      url,
    );

    return p;
  }, [url, name, docFrom, writeable]);

  const extraPlugins: EditorPluginGroup[] = useMemo(
    () => [
      {
        key: 'chat',
        plugins: [new ChatPlugin()],
      },
      {
        key: 'online',
        plugins: [new OnlinePlugin(), new UserStatesPlugin()],
      },
    ],
    [],
  );

  return (
    <Editor
      provider={provider}
      writeable={writeable}
      extraPlugins={extraPlugins}
    />
  );
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

    if (rawFrom === 'share') {
      model.updateParams({
        from: 'share',
        path: splitPath(rawPath ?? ''),
        shareId: Number.parseInt(rawShareId ?? '0'),
      });
    } else if (rawFrom === 'space') {
      model.updateParams({
        from: 'space',
        path: splitPath(rawPath ?? ''),
      });
    }
  }, [searchParams]);

  useEffect(() => {
    let title = model.file?.filename ?? '';
    if (model.writeable) {
      title += ' - 编辑文档';
    } else {
      title += ' - 查看文档';
    }

    title += ' - ' + PROJECT_NAME;

    document.title = title;
  }, [model.file?.filename, model.writeable]);

  if (model.error) {
    return <div>{model.error.message}</div>;
  }

  const breadcrumb =
    model.params.from === 'space' ? (
      <SpaceBreadcrumb path={model.params.path} />
    ) : (
      <ShareBreadcrumb
        shareId={model.params.shareId ?? 0}
        path={model.params.path}
      />
    );

  return (
    <Spin spinning={model.loading}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {breadcrumb}

        {model.unrefFile?.fid ? (
          <Doc
            name={model.unrefFile.fid.toString()}
            docFrom={model.params}
            writeable={model.writeable}
          />
        ) : null}
      </Space>
    </Spin>
  );
};

export default DocPage;
