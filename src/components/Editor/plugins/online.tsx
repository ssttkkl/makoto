import { YjsEditor } from '@slate-yjs/core';
import { Badge } from 'antd';
import { useSlate } from 'slate-react';
import { EditorPlugin } from './base';
import { ToolbarItem } from './types';

const OnlineStatus: React.FC = () => {
  const editor = useSlate() as YjsEditor;
  const connected = YjsEditor.connected(editor);

  if (connected) {
    return <Badge status="success" text="在线" />;
  } else {
    return <Badge status="error" text="离线" />;
  }
};

export class OnlinePlugin extends EditorPlugin {
  key = 'online';
  toolbarItem: ToolbarItem = {
    title: '在线状态',
    renderReadonly: () => <OnlineStatus />,
    renderWriteable: () => <OnlineStatus />,
  };
}
