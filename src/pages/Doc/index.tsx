import { useSearchParams } from '@umijs/max';
import { HocuspocusProvider } from '@hocuspocus/provider';
import { withYHistory, withYjs, YjsEditor } from '@slate-yjs/core';
import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { createEditor, Descendant } from 'slate';
import { withReact } from 'slate-react';
import * as Y from 'yjs';
import { HOCUSPOCUS_ENDPOINT_URL } from '../../config';
import Editor from '@/components/Editor';
import { useModel } from '@umijs/max';
import { mergePath, splitPath } from '@/utils/path';
import { Spin } from 'antd';
import { useAccessToken } from '@/services/auth/token';

const Doc: React.FC<{
  name: string;
  params: any;
  writeable?: boolean;
}> = ({ name, params, writeable }) => {
  const [value, setValue] = useState<Descendant[]>([]);
  const [, /*connected*/ setConnected] = useState(false);
  const token = useAccessToken();

  const provider = useMemo(
    () =>
      new HocuspocusProvider({
        url: HOCUSPOCUS_ENDPOINT_URL,
        name: name,
        parameters: {
          ...params,
          path: mergePath(params.path),
          writeable: writeable,
        },
        token: token,
        onConnect: () => setConnected(true),
        onDisconnect: () => setConnected(false),
      }),
    [name, params, writeable, token],
  );

  const editor = useMemo(() => {
    const sharedType = provider.document.get('content', Y.XmlText) as Y.XmlText;

    return withReact(
      withYHistory(withYjs(createEditor(), sharedType, { autoConnect: false })),
    );
  }, [provider.document]);

  // Connect editor and provider in useEffect to comply with concurrent mode
  // requirements.
  useEffect(() => {
    provider.connect();
    return () => provider.disconnect();
  }, [provider]);

  useEffect(() => {
    YjsEditor.connect(editor);
    return () => YjsEditor.disconnect(editor);
  }, [editor]);

  return (
    <Editor
      value={value}
      onChange={setValue}
      editor={editor}
      writeable={writeable}
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
