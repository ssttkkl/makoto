import { getProfile } from '@/services/users';
import { User } from '@/services/users/entities';
import { useRequest } from '@/utils/request';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { Avatar as AntdAvatar, AvatarProps, Space, Spin } from 'antd';
import Tooltip from 'antd/es/tooltip';
import { Mutex } from 'async-mutex';
import { CSSProperties } from 'react';

class UserCache {
  private readonly cache = new Map<number, User>();
  private readonly mutex = new Map<number, Mutex>();

  private async fetch(uid: number): Promise<User> {
    return await getProfile({ uid });
  }

  async get(uid: number): Promise<User> {
    if (!this.cache.has(uid)) {
      if (!this.mutex.has(uid)) {
        this.mutex.set(uid, new Mutex());
      }

      await this.mutex.get(uid)!.runExclusive(async () => {
        if (!this.cache.has(uid)) {
          const user = await this.fetch(uid);
          this.cache.set(uid, user);
        }
      });
    }
    return this.cache.get(uid)!;
  }
}

const cache = new UserCache();

const Name: React.FC<{
  name?: string;
  className?: string;
  style?: CSSProperties;
}> = ({ name, className, style }) => {
  const nameClassName = useEmotionCss(() => ({
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  }));

  return (
    <span className={`${nameClassName} ${className ?? ''}`} style={style}>
      {name}
    </span>
  );
};

const Avatar: React.FC<
  AvatarProps & {
    user?: User;
    isSelf?: boolean;
  }
> = ({ user, isSelf, className, ...props }) => {
  let selfAvatarClassName = useEmotionCss(({ token }) => ({
    backgroundColor: `${token.green} !important`,
    color: 'white !important',
  }));

  let avatarClassName = isSelf ? selfAvatarClassName : '';

  if (className) {
    avatarClassName = className + ' ' + avatarClassName;
  }

  return (
    <AntdAvatar size="small" {...props} className={avatarClassName}>
      {user?.nickname ? user?.nickname[0] : ''}
    </AntdAvatar>
  );
};

export const UserNickname: React.FC<{
  uid?: number;
  user?: User;
  className?: string;
  style?: CSSProperties;
}> = ({ uid, user, className, style }) => {
  const { data, loading } = useRequest(async () => {
    if (uid) {
      return await cache.get(uid);
    }
    if (user === undefined) {
      throw new Error('Please set either uid or user');
    }
    return user;
  });

  return (
    <Spin spinning={loading}>
      <Name name={data?.nickname} className={className} style={style} />
    </Spin>
  );
};

export const UserAvatarWithNickname: React.FC<{
  uid?: number;
  user?: User;
  isSelf?: boolean;
  avatarProps?: AvatarProps;
  nicknameProps?: { className?: string; style?: CSSProperties };
}> = ({ uid, user, isSelf, avatarProps, nicknameProps }) => {
  const { data, loading } = useRequest(async () => {
    if (uid) {
      return await cache.get(uid);
    }
    if (user === undefined) {
      throw new Error('Please set either uid or user');
    }
    return user;
  });

  let nicknameClassName = useEmotionCss(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));

  if (nicknameProps?.className) {
    nicknameClassName = nicknameProps.className + ' ' + nicknameClassName;
  }

  return (
    <Spin spinning={loading}>
      <Space direction="horizontal">
        <Avatar size="small" {...avatarProps} user={data} isSelf={isSelf} />

        <Name
          name={data?.nickname}
          className={nicknameClassName}
          style={nicknameProps?.style}
        />
      </Space>
    </Spin>
  );
};

export const UserAvatar: React.FC<
  {
    uid?: number;
    user?: User;
    isSelf?: boolean;
  } & AvatarProps
> = ({ uid, user, isSelf, ...props }) => {
  const { data, loading } = useRequest(async () => {
    if (uid) {
      return await cache.get(uid);
    }
    if (user === undefined) {
      throw new Error('Please set either uid or user');
    }
    return user;
  });

  return (
    <Spin spinning={loading}>
      <Tooltip title={data?.nickname ?? ''}>
        <Avatar {...props} user={data} isSelf={isSelf} />
      </Tooltip>
    </Spin>
  );
};
