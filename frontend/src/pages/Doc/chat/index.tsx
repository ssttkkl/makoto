import { UserAvatarWithNickname } from '@/components/UserAvatar';
import { Chat } from '@/services/chat/entities';
import { useIsIntersecting, useWindowSize } from '@/utils/hooks';
import { MessageOutlined } from '@ant-design/icons';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { useModel } from '@umijs/max';
import { App, Badge, Form, Input } from 'antd';
import Button from 'antd/es/button';
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import ChatView from './ChatView';
import { createChatEventSource, getChat, postChat } from '@/services/chat';
import { useObservable } from 'rxjs-hooks';
import { plainToInstance } from 'class-transformer';
import { currentUser } from '@/services/auth';
import '../../../general.css';

const ChatModalContent: React.FC<{
  chat: Observable<Chat[]>;
}> = ({ chat: rxChat }) => {
  const [height] = useWindowSize();
  const className = useEmotionCss(() => ({
    height: height * 0.7,
    overflowY: 'scroll',
  }));

  const wrapper = useRef<HTMLDivElement>(null);
  const bottom = useRef<HTMLDivElement>(null);

  const isBottomIntersecting = useIsIntersecting(bottom, wrapper);
  console.log(`isBottomIntersecting: ${isBottomIntersecting}`);

  const scrollToBottom = useCallback(() => {
    if (wrapper.current) {
      wrapper.current.scrollTop = wrapper.current.scrollHeight;
    }
  }, [wrapper.current]);

  const chat = useObservable(() => rxChat);
  const [loadingChat, setLoadingChat] = useState(true);

  // 打开时滚动到最底端
  useEffect(() => {
    if (chat && loadingChat) {
      setLoadingChat(false);
      scrollToBottom();
    }
  }, [chat, loadingChat, scrollToBottom]);

  // 如果处于最底端，有新消息时滚动到新消息
  useEffect(() => {
    if (isBottomIntersecting) {
      scrollToBottom();
    }
  }, [chat, isBottomIntersecting, scrollToBottom]);

  return (
    <div className={className} ref={wrapper}>
      <ChatView rxChat={rxChat} bottomRef={bottom} />
    </div>
  );
};

const ChatModalFooter: React.FC<{
  room: string;
}> = ({ room }) => {
  const isLoggedIn =
    useObservable(() => currentUser.pipe(map((x) => Boolean(x?.uid)))) ?? false;
  const formClassName = useEmotionCss(({ token }) => ({
    marginTop: token.margin,
    display: 'flex',
  }));

  const contentClassName = useEmotionCss(({ token }) => ({
    marginInlineEnd: token.marginSM,
    flex: 1,
  }));

  const [form] = Form.useForm();

  const send = async ({ content }: { content: string }) => {
    await postChat({ room, content });
    form.resetFields();
  };

  return (
    <Form
      form={form}
      name="send"
      layout="inline"
      className={formClassName}
      onFinish={send}
    >
      <Form.Item
        name="content"
        rules={[{ required: true, message: '请输入要发送的内容！' }]}
        noStyle
      >
        <Input placeholder="输入消息……" className={contentClassName} />
      </Form.Item>
      <Form.Item shouldUpdate noStyle>
        {() => (
          <Button
            type="primary"
            htmlType="submit"
            disabled={
              !form.isFieldsTouched(true) ||
              !!form.getFieldsError().filter(({ errors }) => errors.length)
                .length ||
              !isLoggedIn
            }
          >
            发送
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};

export const ChatButton: React.FC = () => {
  const { modal, notification } = App.useApp();
  const { unrefFile } = useModel('Doc.model', (model) => ({
    unrefFile: model.unrefFile,
  }));

  const chatRoomName = unrefFile?.fid ? `doc-${unrefFile.fid}` : undefined;

  // 用RxJS解决Modal中无法响应Model变动的问题
  const chat = useMemo(() => new BehaviorSubject<Chat[]>([]), []);
  const chatSubject = useMemo(() => new Subject<Chat>(), []);

  const chatEventSource = useMemo(
    () => new BehaviorSubject<EventSource | null>(null),
    [],
  );

  useEffect(() => {
    if (chatRoomName) {
      const now = new Date();
      getChat({
        room: chatRoomName,
        before: now,
      }).then((v) => {
        console.log('load chat: ', v);
        chat.next(v);

        const src = createChatEventSource({ room: chatRoomName, after: now });
        src.onopen = () => {
          console.log('chat event source opened: ' + chatRoomName);
        };
        src.onmessage = (e) => {
          const data = plainToInstance(Chat, JSON.parse(e.data));
          console.log('chat received: ', data);
          chat.next([...chat.getValue(), data]);
          chatSubject.next(data);
        };
        chatEventSource.next(src);
      });
    }
    return () => {
      chat.next([]);
      const src = chatEventSource.getValue();
      if (src) {
        src.close();
        chatEventSource.next(null);
      }
    };
  }, [chatRoomName]);

  const [isOpen, setOpen] = useState(false);
  const [unread, dispatchUnread] = useReducer(
    (state: number, action: string) => {
      switch (action) {
        case 'inc':
          return state + 1;
        case 'dec':
          return state - 1;
        case 'reset':
          return 0;
        default:
          throw new Error('invalid action: ' + action);
      }
    },
    0,
  );

  const openChatModal = useCallback(() => {
    setOpen(true);
    dispatchUnread('reset');
    modal.info({
      title: '实时沟通',
      centered: true,
      content: <ChatModalContent chat={chat} />,
      footer: chatRoomName ? <ChatModalFooter room={chatRoomName} /> : null,
      closable: true,
      okButtonProps: {
        style: { visibility: 'hidden' },
      },
      width: '80%',
      afterClose: () => setOpen(false),
    });
  }, [modal, chat, chatRoomName, setOpen, dispatchUnread]);

  useEffect(() => {
    if (!isOpen) {
      const sub = chatSubject.subscribe({
        next: (c) => {
          dispatchUnread('inc');
          notification.open({
            message: <UserAvatarWithNickname uid={c.uid} />,
            description: c.content,
            onClick: openChatModal,
          });
        },
      });
      return () => sub.unsubscribe();
    }
  }, [isOpen, chatSubject, notification, openChatModal]);

  return (
    <Badge count={unread}>
      <Button icon={<MessageOutlined />} onClick={openChatModal}>
        实时沟通
      </Button>
    </Badge>
  );
};
