import { UserAvatar, UserNickname } from '@/components/UserAvatar';
import { Chat } from '@/services/chat/entities';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { List, Space } from 'antd';
import React, { forwardRef, RefObject } from 'react';
import { Observable } from 'rxjs';
import { useObservable } from 'rxjs-hooks';
import { User } from '@/services/users/entities';
import { useFriendlyDateFormatter } from '@/utils/hooks';

const ChatItem = forwardRef<HTMLDivElement, { chat: Chat; isSelf: boolean }>(
  ({ chat, isSelf }, ref) => {
    const timeClassName = useEmotionCss(({ token }) => ({
      color: token.colorTextLabel,
      fontSize: token.fontSizeSM,
      fontWeight: 'normal',
    }));

    const wrapClassName = useEmotionCss(() => ({
      width: '100%',
    }));

    const formatDate = useFriendlyDateFormatter();

    return (
      <List.Item>
        <div ref={ref} className={wrapClassName}>
          <List.Item.Meta
            avatar={<UserAvatar uid={chat.uid} isSelf={isSelf} />}
            title={
              <Space>
                <UserNickname uid={chat.uid} />
                <span className={timeClassName}>
                  {formatDate(chat.ctime)} {chat.ctime.toLocaleTimeString()}
                </span>
              </Space>
            }
            description={chat.content}
          />
        </div>
      </List.Item>
    );
  },
);

const ChatView: React.FC<{
  rxChat: Observable<Chat[]>;
  currentUser?: User;
  bottomRef?: RefObject<HTMLDivElement>;
}> = ({ rxChat, currentUser, bottomRef }) => {
  const chat_ = useObservable(() => rxChat);
  const chat = chat_ ?? [];

  return (
    <List
      dataSource={chat}
      renderItem={(c, index) => {
        if (index === chat.length - 1) {
          return (
            <ChatItem
              chat={c}
              isSelf={currentUser?.uid === c.uid}
              ref={bottomRef}
            />
          );
        } else {
          return <ChatItem chat={c} isSelf={currentUser?.uid === c.uid} />;
        }
      }}
      key="id"
      split={false}
    />
  );
};

export default ChatView;
