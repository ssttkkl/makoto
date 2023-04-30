import { UserAvatar } from '@/components/UserAvatar';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { CursorEditor } from '@slate-yjs/core';
import { useModel } from '@umijs/max';
import { Space } from 'antd';
import { useSlate } from 'slate-react';
import { CursorData } from '../types';
import { EditorPlugin } from './base';
import { ToolbarItem } from './types';

const UserState: React.FC<{ cursor: CursorData }> = ({ cursor }) => {
  const className = useEmotionCss(() => ({
    backgroundColor: `${cursor.color} !important`,
    color: 'white !important',
  }));

  return <UserAvatar uid={cursor.uid} size="small" className={className} />;
};

const UserStates: React.FC = () => {
  const { currentUser } = useModel('currentUser');
  const editor = useSlate() as CursorEditor<CursorData>;
  const states = CursorEditor.cursorStates(editor);
  return (
    <Space direction="horizontal">
      {Object.entries(states).map(([clientId, { data }]) =>
        data && data.uid !== currentUser?.uid ? (
          <UserState key={clientId} cursor={data} />
        ) : null,
      )}
    </Space>
  );
};

export class UserStatesPlugin extends EditorPlugin {
  key = 'user-states';
  toolbarItem: ToolbarItem = {
    title: '在线用户',
    renderReadonly: () => <UserStates />,
    renderWriteable: () => <UserStates />,
  };
}
