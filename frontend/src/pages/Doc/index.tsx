import { useModel, useSearchParams } from '@umijs/max';
import { HocuspocusProvider } from '@hocuspocus/provider';
import React, { useEffect, useState } from 'react';
import Editor from '@/components/Editor';
import { mergePath, splitPath } from '@/utils/path';
import { Divider, Space, Spin } from 'antd';
import { getAccessToken } from '@/services/auth/token';
import { refreshExclusive } from '@/services/auth';
import { SpaceBreadcrumb } from '@/components/SpaceBreadcrumb';
import { ShareBreadcrumb } from '@/components/ShareBreadcrumb';
import { ChatButton } from '@/pages/Doc/chat';
import { OnlineStatus } from '@/pages/Doc/online';
import { UserStates } from '@/pages/Doc/user-states';
import { DocFrom } from './types';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import '../../general.css';
import { DocMenu } from './menu';

const Doc: React.FC<{
  name: string;
  docFrom: DocFrom;
  writeable: boolean;
}> = ({ name, docFrom, writeable }) => {
  const url =
    process.env.NODE_ENV === 'development'
      ? DEV_HOCUSPOCUS_ENDPOINT
      : `ws://${location.hostname}:${location.port}/hocuspocus`;

  const [provider, setProvider] = useState<HocuspocusProvider>();

  useEffect(() => {
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
      'a new provider was created. name: ' + name + ', params: ',
      params,
      ', url: ' + url,
    );

    setProvider(p);

    return () => {
      p.destroy();
      console.log('provider was destroyed');
    };
  }, [url, name, docFrom, writeable]);

  const breadcrumb =
    docFrom.from === 'space' ? (
      <SpaceBreadcrumb path={docFrom.path} />
    ) : (
      <ShareBreadcrumb shareId={docFrom.shareId ?? 0} path={docFrom.path} />
    );

  const headerClassName = useEmotionCss(({ token }) => ({
    display: 'flex',
    marginBlockEnd: token.margin,
  }));

  const operationsClassName = useEmotionCss(() => ({
    flex: 1,
    justifyContent: 'flex-end',
  }));

  const header = (
    <>
      <div className={headerClassName}>
        {breadcrumb}
        <Space className={operationsClassName}>
          <OnlineStatus />
          <UserStates />
          <Divider />
          <ChatButton />
          <Divider />
          <DocMenu />
        </Space>
      </div>
    </>
  );

  return provider ? (
    <Editor provider={provider} writeable={writeable} header={header} />
  ) : null;
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

  return (
    <Spin spinning={model.loading}>
      {model.unrefFile?.fid ? (
        <Doc
          name={model.unrefFile.fid.toString()}
          docFrom={model.params}
          writeable={model.writeable}
        />
      ) : null}
    </Spin>
  );
};

export default DocPage;
