import { useModel } from '@umijs/max';
import { Space } from 'antd';
import LinkButton from './LinkButton';
import FavButton from './FavButton';

export const ShareOperationBar: React.FC = () => {
  const { currentUser } = useModel('currentUser');
  const model = useModel('Share.model');

  const isOwner =
    currentUser !== undefined && model.share?.ownerUid === currentUser?.uid;

  const btn: React.ReactNode[] = [];

  btn.push(<FavButton key="fav" type="primary" />);
  if (!isOwner && model.share?.allowLink === true) {
    btn.push(<LinkButton key="link" />);
  }

  return <Space wrap>{btn}</Space>;
};
