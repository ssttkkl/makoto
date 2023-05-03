import { useModel } from '@umijs/max';
import { App, Descriptions } from 'antd';
import { Operation, OperationBar } from '@/components/OperationBar';
import { expireShare, favShare, unfavShare } from '@/services/share';
import {
  CloseOutlined,
  InfoCircleOutlined,
  LinkOutlined,
  StarFilled,
  StarOutlined,
} from '@ant-design/icons';
import { mapPermission } from '@/utils/permission';
import { LinkFileFormButton } from './LinkFileFormButton';
import { OperationButton } from '@/components/OperationButton';
import { UserAvatarWithNickname } from '@/components/UserAvatar';
import { useFriendlyDateTimeFormatter } from '@/utils/hooks';

function useFavOperation(): Operation {
  const { message } = App.useApp();
  const model = useModel('Share.model', (model) => ({
    share: model.share,
    refresh: model.refresh,
  }));
  const shareId = model.share?.shareId;

  if (model.share?.fav === true) {
    return {
      key: 'unfav',
      title: '已收藏',
      icon: <StarFilled />,
      btnProps: {
        type: 'primary',
      },
      onClick: async () => {
        if (shareId !== undefined) {
          await unfavShare({ shareId });
          message.success('成功取消收藏分享');
          await model.refresh();
        }
      },
    };
  } else {
    return {
      key: 'fav',
      title: '收藏',
      icon: <StarOutlined />,
      btnProps: {
        type: 'primary',
      },
      onClick: async () => {
        if (shareId !== undefined) {
          await favShare({ shareId });
          message.success('成功收藏分享');
          await model.refresh();
        }
      },
    };
  }
}

export const ShareOperationBar: React.FC = () => {
  const { message, modal } = App.useApp();
  const formatDate = useFriendlyDateTimeFormatter();

  const { currentUser } = useModel('currentUser');
  const model = useModel('Share.model');

  const files = model.selectedFiles;

  const isOwner =
    currentUser !== undefined && model.share?.ownerUid === currentUser?.uid;

  const favOp = useFavOperation();

  const linkTitle = files.length === 0 ? '链接所有文件' : '链接选中文件';
  const linkFiles = files.length === 0 ? model.files ?? [] : files;
  const linkOp: Operation = {
    key: 'link',
    title: linkTitle,
    render: (key: string, mini: boolean) => {
      if (model.share === undefined) {
        return;
      }

      return (
        <LinkFileFormButton
          key={key}
          shareId={model.share.shareId}
          refPath={linkFiles.map((x) => [...model.params.path, x.filename])}
          onFinish={async () => {
            message.success('链接文件成功');
            await model.refresh();
            return true;
          }}
          trigger={
            <OperationButton
              title={linkTitle}
              icon={<LinkOutlined />}
              mini={mini}
            />
          }
        />
      );
    },
  };

  const expireOp: Operation = {
    key: 'expire',
    title: '取消分享',
    icon: <CloseOutlined />,
    btnProps: {
      danger: true,
    },
    onClick: async () => {
      if (model.share === undefined) {
        return;
      }

      await expireShare({ shareId: model.share.shareId });
      message.success('成功取消分享');
      model.refresh();
    },
  };

  const basic = [favOp];
  if (!isOwner && model.share?.allowLink === true) {
    basic.push(linkOp);
  }
  if (isOwner && model.share?.expired === false) {
    basic.push(expireOp);
  }

  const info = [
    {
      key: 'info',
      title: '分享信息',
      icon: <InfoCircleOutlined />,
      onClick: async () => {
        modal.info({
          title: '分享信息',
          content: (
            <Descriptions column={1}>
              <Descriptions.Item label="分享名">
                {model.share?.title}
              </Descriptions.Item>
              <Descriptions.Item label="创建者">
                <UserAvatarWithNickname uid={model.share?.ownerUid} />
              </Descriptions.Item>
              <Descriptions.Item label="权限">
                {mapPermission(model.share?.permission ?? 0)}
              </Descriptions.Item>
              <Descriptions.Item label="允许链接">
                {model.share?.allowLink ? '是' : '否'}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {formatDate(model.share?.ctime)}
              </Descriptions.Item>
              <Descriptions.Item label="失效时间">
                {formatDate(model.share?.etime)}
              </Descriptions.Item>
              <Descriptions.Item label="已失效">
                {model.share?.expired ? '是' : '否'}
              </Descriptions.Item>
            </Descriptions>
          ),
        });
      },
    },
  ];

  const op = [basic, info];

  return <OperationBar operations={op} />;
};
