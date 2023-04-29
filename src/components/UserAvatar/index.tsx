import { getProfile } from '@/services/profiles';
import { User } from '@/services/users/entities';
import { useRequest } from '@/utils/request';
import { Theme, useEmotionCss } from '@ant-design/use-emotion-css';
import { Avatar, AvatarProps, Space, Spin } from 'antd';
import Tooltip from 'antd/es/tooltip';
import { CSSProperties } from 'react';

const buildAvatarClassname = ({ token }: Theme, other?: CSSProperties) => {
  return {
    verticalAlign: 'top',
    [`@media only screen and (max-width: ${token.screenMD}px)`]: {
      margin: 0,
    },
    ...other,
  };
};

const Name: React.FC<{
  name?: string;
  className?: string;
  style?: CSSProperties;
}> = ({ name, className, style }) => {
  const nameClassName = useEmotionCss(({ token }) => ({
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    [`@media only screen and (max-width: ${token.screenMD}px)`]: {
      display: 'none',
    },
  }));

  return (
    <span
      className={`${nameClassName} anticon ${className ?? ''}`}
      style={style}
    >
      {name}
    </span>
  );
};

export const UserNickname: React.FC<{
  uid?: number;
  user?: User;
  className?: string;
  style?: CSSProperties;
}> = ({ uid, user, className, style }) => {
  const { data, loading } = useRequest(async () => {
    if (uid) return await getProfile({ uid });
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
  avatarProps?: AvatarProps;
  nicknameProps?: { className?: string; style?: CSSProperties };
}> = ({ uid, user, avatarProps, nicknameProps }) => {
  const { data, loading } = useRequest(async () => {
    if (uid) return await getProfile({ uid });
    return user;
  });

  let avatarClassName = useEmotionCss((token) => buildAvatarClassname(token));

  let nicknameClassName = useEmotionCss(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));

  if (avatarProps?.className) {
    avatarClassName = avatarProps.className + ' ' + avatarClassName;
  }

  if (nicknameProps?.className) {
    nicknameClassName = nicknameProps.className + ' ' + nicknameClassName;
  }

  return (
    <Spin spinning={loading}>
      <Space direction="horizontal">
        <Avatar size="small" {...avatarProps} className={avatarClassName}>
          {data?.nickname ? data.nickname[0] : ''}
        </Avatar>

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
  } & AvatarProps
> = ({ uid, user, className, ...props }) => {
  let avatarClassName = useEmotionCss((token) => buildAvatarClassname(token));

  const { data, loading } = useRequest(async () => {
    if (uid) return await getProfile({ uid });
    return user;
  });

  if (className) {
    avatarClassName = avatarClassName + ' ' + className;
  }

  console.log(className, avatarClassName);

  return (
    <Spin spinning={loading}>
      <Tooltip title={data?.nickname ?? ''}>
        <Avatar className={avatarClassName} {...props}>
          {data?.nickname ? data.nickname[0] : ''}
        </Avatar>
      </Tooltip>
    </Spin>
  );
};
