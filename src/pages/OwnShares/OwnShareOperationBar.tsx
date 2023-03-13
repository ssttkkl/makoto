import { Operation, OperationBar } from '@/components/OperationBar';
import { expireShare } from '@/services/share';
import { Share } from '@/services/share/entities';
import { CloseOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { message } from 'antd';

export const OwnSharesOperationBar: React.FC<{
  shares?: Share[];
  mini?: boolean;
}> = ({ shares: _shares, mini: _mini }) => {
  const model = useModel('OwnShares.model');

  const shares = _shares === undefined ? model.selectedShares : _shares;
  const mini = _mini === true;

  const op: Operation[] = [
    {
      key: 'expire',
      title: '取消分享',
      icon: <CloseOutlined />,
      btnProps: {
        disabled: shares.length === 0 || !shares.every((x) => !x.expired),
        danger: true,
      },
      onClick: async () => {
        for (const x of shares) {
          await expireShare({ shareId: x.shareId });
        }
        model.setSelectedShares([]);
        message.success('成功取消分享');
        await model.refresh();
      },
    },
  ];

  return <OperationBar operations={op} mini={mini} />;
};
