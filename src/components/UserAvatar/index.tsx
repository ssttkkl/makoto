import { getProfile } from '@/services/profiles';
import { useRequest } from '@/utils/request';
import { Avatar, AvatarProps, Spin } from 'antd';
import Tooltip from 'antd/es/tooltip';

const UserNickname: React.FC<{ uid: number; className?: string }> = ({
  uid,
  className,
}) => {
  const { data, loading } = useRequest(async () => {
    return await getProfile({ uid });
  });

  return (
    <Spin spinning={loading}>
      <span className={className}>{data?.nickname}</span>
    </Spin>
  );
};

export const UserAvatar: React.FC<{ uid: number } & AvatarProps> = ({
  uid,
  ...props
}) => {
  const { data, loading } = useRequest(async () => {
    return await getProfile({ uid });
  });

  const text = data?.nickname ? data.nickname[0] : '';

  return (
    <Spin spinning={loading}>
      <Tooltip title={data?.nickname ?? ''}>
        <Avatar {...props}>{text}</Avatar>
      </Tooltip>
    </Spin>
  );
};

export default UserNickname;
