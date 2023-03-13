import { useModel } from '@umijs/max';
import { Descriptions, message, Modal } from 'antd';
import { Operation, OperationBar } from '@/components/OperationBar';
import { favShare, unfavShare } from '@/services/share';
import {
  InfoCircleOutlined,
  LinkOutlined,
  StarFilled,
  StarOutlined,
} from '@ant-design/icons';
import { FileInfo } from '@/services/files/entities';
import { createSpaceLink } from '@/services/space';
import { mergePath } from '@/utils/path';
import { mapPermission } from '@/utils/permission';

function useFavOperation(): Operation {
  const model = useModel('Share.model');
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

export const ShareOperationBar: React.FC<{
  files?: FileInfo[];
  mini?: boolean;
}> = ({ files: _files, mini: _mini }) => {
  const { currentUser } = useModel('currentUser');
  const model = useModel('Share.model');

  const files = _files === undefined ? model.selectedFiles : _files;
  const mini = _mini === true;

  const isOwner =
    currentUser !== undefined && model.share?.owner.uid === currentUser?.uid;

  const fav = useFavOperation();
  const link: Operation = {
    key: 'link',
    icon: <LinkOutlined />,
    title: files.length === 0 ? '链接所有文件' : '链接选中文件',
    onClick: async () => {
      if (model.share === undefined) {
        return;
      }

      const linkFiles = files.length === 0 ? model.files ?? [] : files;

      await createSpaceLink({
        basePath: '/',
        shareId: model.share.shareId,
        links: linkFiles.map((x) => {
          return {
            filename: x.filename,
            refPath: mergePath(model.params.path),
          };
        }),
      });
      message.success('成功链接文件到我的空间');
    },
  };

  const basic = [fav];
  if (!isOwner && model.share?.allowLink === true) {
    basic.push(link);
  }

  const info = [
    {
      key: 'info',
      title: '分享信息',
      icon: <InfoCircleOutlined />,
      onClick: async () => {
        Modal.info({
          title: '分享信息',
          content: (
            <Descriptions column={1}>
              <Descriptions.Item label="分享名">
                {model.share?.title}
              </Descriptions.Item>
              <Descriptions.Item label="创建者">
                {model.share?.owner.nickname}
              </Descriptions.Item>
              <Descriptions.Item label="权限">
                {mapPermission(model.share?.permission ?? 0)}
              </Descriptions.Item>
              <Descriptions.Item label="允许链接">
                {model.share?.allowLink ? '是' : '否'}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {model.share?.ctime.toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="失效时间">
                {model.share?.etime.toLocaleString()}
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

  return <OperationBar operations={op} mini={mini} />;
};
