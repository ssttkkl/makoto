import { OperationBar, OperationGroup } from '@/components/OperationBar';
import { unfavShare } from '@/services/share';
import { Share } from '@/services/share/entities';
import { StarFilled } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { message } from 'antd';

export const FavSharesOperationBar: React.FC<{
  shares?: Share[];
  mini?: boolean;
}> = ({ shares: _shares, mini: _mini }) => {
  const model = useModel('FavShares.model', (model) => ({
    selectedShares: model.selectedShares,
    setSelectedShares: model.setSelectedShares,
    refresh: model.refresh,
  }));

  const shares = _shares === undefined ? model.selectedShares : _shares;
  const mini = _mini === true;

  const op: OperationGroup[] = [
    [
      {
        key: 'unfav',
        title: '取消收藏',
        icon: <StarFilled />,
        btnProps: {
          disabled: shares.length === 0,
        },
        onClick: async () => {
          for (const x of shares) {
            await unfavShare({ shareId: x.shareId });
          }
          model.setSelectedShares([]);
          message.success('成功取消收藏分享');
          await model.refresh();
        },
      },
    ],
  ];

  return <OperationBar operations={op} mini={mini} />;
};
