import { HocuspocusProvider } from '@hocuspocus/provider';
import { withYHistory, withYjs, YjsEditor } from '@slate-yjs/core';
import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { createEditor, Descendant } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';
import * as Y from 'yjs';
import { HOCUSPOCUS_ENDPOINT_URL } from '../../config';

const Editor: React.FC<{ fid: number }> = (props) => {
  const [value, setValue] = useState<Descendant[]>([]);
  const [, /*connected*/ setConnected] = useState(false);

  const provider = useMemo(
    () =>
      new HocuspocusProvider({
        url: HOCUSPOCUS_ENDPOINT_URL,
        name: props.fid.toString(),
        onConnect: () => setConnected(true),
        onDisconnect: () => setConnected(false),
      }),
    [],
  );

  const editor = useMemo(() => {
    const sharedType = provider.document.get('content', Y.XmlText) as Y.XmlText;

    return withReact(
      withYHistory(withYjs(createEditor(), sharedType, { autoConnect: false })),
    );
  }, [provider.awareness, provider.document]);

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
    <Slate value={value} onChange={setValue} editor={editor}>
      <Editable />
    </Slate>
  );
};

export default Editor;
