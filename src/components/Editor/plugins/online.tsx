import { UserAvatar } from '@/components/UserAvatar';
import { CursorEditor } from '@slate-yjs/core';
import { Space } from 'antd';
import { useSlate } from 'slate-react';
import { CursorData } from '../types';
import { EditorPlugin } from './base';
import { ToolbarItem } from './types';

const UserState: React.FC<{ cursor: CursorData }> = ({ cursor }) => {
  return (
    <UserAvatar
      uid={cursor.uid}
      size="small"
      style={{ backgroundColor: cursor.color }}
    />
  );
};

const UserStates: React.FC = () => {
  const editor = useSlate() as CursorEditor<CursorData>;
  const states = CursorEditor.cursorStates(editor);
  console.log('states: ', states);
  return (
    <Space direction="horizontal">
      {Object.values(states).map((x) =>
        x.data ? <UserState key={x.data.uid} cursor={x.data} /> : null,
      )}
    </Space>
  );
};

export class OnlinePlugin extends EditorPlugin {
  key = 'user-states';
  toolbarItem: ToolbarItem = {
    title: '在线状态',
    renderReadonly: () => <UserStates />,
    renderWriteable: () => <UserStates />,
  };
}
