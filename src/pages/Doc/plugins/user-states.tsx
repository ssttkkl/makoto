import { UserAvatar } from '@/components/UserAvatar';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { CursorEditor } from '@slate-yjs/core';
import { Space } from 'antd';
import { useSlate } from 'slate-react';
import { CursorData } from '../../../components/Editor/types';
import { EditorPlugin } from '../../../components/Editor/plugins/base';
import { ToolbarItem } from '../../../components/Editor/plugins/types';
import { plainToInstance } from 'class-transformer';
import { User } from '@/services/users/entities';

const GUEST = plainToInstance(User, { uid: 0, nickname: '游客', username: '' });

const UserState: React.FC<{ cursor: CursorData }> = ({ cursor }) => {
  const className = useEmotionCss(() => ({
    backgroundColor: `${cursor.color} !important`,
    color: 'white !important',
  }));

  if (cursor.uid) {
    return <UserAvatar uid={cursor.uid} size="small" className={className} />;
  } else {
    return <UserAvatar user={GUEST} size="small" className={className} />;
  }
};

const UserStates: React.FC = () => {
  const editor = useSlate() as CursorEditor<CursorData>;

  return (
    <Space direction="horizontal">
      {Object.entries(CursorEditor.cursorStates(editor)).map(
        ([clientId, { data }]) => (
          <UserState key={clientId} cursor={data} />
        ),
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
