import { useSearchParams } from '@umijs/max';
import { HocuspocusProvider } from '@hocuspocus/provider';
import { withCursors, withYHistory, withYjs, YjsEditor } from '@slate-yjs/core';
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
import randomColor from 'randomcolor';
import { CursorData } from '@/components/Editor/types';

function makeCursorData(uid: number, writeable: boolean): CursorData {
  return {
    color: randomColor({
      luminosity: 'dark',
      alpha: 1,
      format: 'hex',
    }),
    uid,
    writeable,
  };
}

const Doc: React.FC<{
  name: string;
  params: any;
  writeable: boolean;
}> = ({ name, params, writeable }) => {
  const { currentUser } = useModel('currentUser');

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
        token,
        connect: token !== null, // prevent connect without token
        onConnect: () => setConnected(true),
        onDisconnect: () => setConnected(false),
      }),
    [name, params, writeable, token],
  );

  const editor = useMemo(() => {
    const sharedType = provider.document.get('content', Y.XmlText) as Y.XmlText;

    return withReact(
      withYHistory(
        withCursors(
          withYjs(createEditor(), sharedType, { autoConnect: false }),
          provider.awareness,
          {
            data: currentUser
              ? makeCursorData(currentUser.uid, writeable)
              : undefined,
          },
        ),
      ),
    );
  }, [currentUser, provider.awareness, provider.document]);

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
