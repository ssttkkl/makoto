import { getProfile } from '@/services/profiles';
import { useRequest } from '@/utils/request';
import { Spin } from 'antd';

const UserNickname: React.FC<{ uid: number }> = ({ uid }) => {
  const { data, loading } = useRequest(async () => {
    return await getProfile({ uid });
  });

  return <Spin spinning={loading}>{data?.nickname}</Spin>;
};

export default UserNickname;
