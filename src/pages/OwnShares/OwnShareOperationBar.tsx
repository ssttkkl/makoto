import { OperationBar, OperationGroup } from '@/components/OperationBar';
import { expireShare } from '@/services/share';
import { Share } from '@/services/share/entities';
import { CloseOutlined } from '@ant-design/icons';
import { App } from 'antd';

export const OwnSharesOperationBar: React.FC<{
  shares: Share[];
  mini?: boolean;
  refresh?: () => Promise<any>;
}> = ({ shares, mini: _mini, refresh }) => {
  const { message } = App.useApp();

  const mini = _mini === true;

  const op: OperationGroup[] = [
    [
      {
        key: 'expire',
        title: '取消分享',
        icon: <CloseOutlined />,
        btnProps: {
          disabled: shares.length === 0,
          danger: true,
        },
        onClick: async () => {
          for (const x of shares) {
            await expireShare({ shareId: x.shareId });
          }
          message.success('成功取消分享');
          if (refresh) {
            await refresh();
          }
        },
      },
    ],
  ];

  return <OperationBar operations={op} mini={mini} />;
};
