import { useModel } from '@umijs/max';
import { message } from 'antd';
import { Operation, OperationBar } from '@/components/OperationBar';
import { favShare, unfavShare } from '@/services/share';
import { StarFilled, StarOutlined } from '@ant-design/icons';
import { FileInfo } from '@/services/files/entities';
import { createSpaceLink } from '@/services/space';
import { mergePath } from '@/utils/path';

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
    title: files.length === 0 ? '链接所有文件' : '链接选中文件',
    onClick: async () => {
      if (model.share === undefined) {
        return;
      }

      await createSpaceLink({
        basePath: '/',
        shareId: model.share.shareId,
        links: files.map((x) => {
          return {
            filename: x.filename,
            refPath: mergePath(model.params.path),
          };
        }),
      });
      message.success('成功链接文件到我的空间');
    },
  };

  const op = [fav];
  if (!isOwner && model.share?.allowLink === true) {
    op.push(link);
  }

  return <OperationBar operations={op} mini={mini} />;
};
