import { getProfile } from '@/services/users';
import { User } from '@/services/users/entities';
import { useRequest } from '@/utils/request';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { Avatar as AntdAvatar, AvatarProps, Space, Spin } from 'antd';
import Tooltip from 'antd/es/tooltip';
import { Mutex } from 'async-mutex';
import { CSSProperties } from 'react';
import { useObservable } from 'rxjs-hooks';
import { currentUser as rxCurrentUser } from '../../services/auth';

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
  const { data } = useRequest(async () => {
    if (uid) {
      return await cache.get(uid);
    }
    return user;
  });

  return (
    <Spin spinning={!data}>
      <Name name={data?.nickname} className={className} style={style} />
    </Spin>
  );
};

export const UserAvatarWithNickname: React.FC<{
  uid?: number;
  user?: User;
  avatarProps?: AvatarProps;
  nicknameProps?: { className?: string; style?: CSSProperties };
}> = ({ uid, user, avatarProps, nicknameProps }) => {
  const currentUser = useObservable(() => rxCurrentUser);
  const { data } = useRequest(async () => {
    if (uid) {
      return await cache.get(uid);
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
    <Spin spinning={!data}>
      <Space direction="horizontal">
        <Avatar
          size="small"
          {...avatarProps}
          user={data}
          isSelf={currentUser?.uid === data?.uid && Boolean(currentUser?.uid)}
        />

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
    tooltip?: boolean;
  } & AvatarProps
> = ({ uid, user, tooltip, ...props }) => {
  const currentUser = useObservable(() => rxCurrentUser);
  const { data } = useRequest(async () => {
    if (uid) {
      return await cache.get(uid);
    }
    return user;
  });

  const avatar = (
    <Avatar
      {...props}
      user={data}
      isSelf={currentUser?.uid === data?.uid && Boolean(currentUser?.uid)}
    />
  );

  return (
    <Spin spinning={!data}>
      {tooltip === false ? (
        avatar
      ) : (
        <Tooltip title={data?.nickname ?? ''}>{avatar}</Tooltip>
      )}
    </Spin>
  );
};
