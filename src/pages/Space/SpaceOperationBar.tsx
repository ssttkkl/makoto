import { Operation, OperationBar } from '@/components/OperationBar';
import { OperationButton } from '@/components/OperationButton';
import { FileInfo } from '@/services/files/entities';
import { moveIntoRecycleBin } from '@/services/recycle-bin';
import { mergePath } from '@/utils/path';
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  FileOutlined,
  FolderOutlined,
  ScissorOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { message } from 'antd';
import { useCallback } from 'react';
import {
  CreateDocumentFormButton,
  CreateFolderFormButton,
} from './CreateFileForm';
import CreateShareForm from './CreateShareForm';

const SpaceOperationBar: React.FC<{
  files?: FileInfo[];
  mini?: boolean;
}> = ({ files: _files, mini: _mini }) => {
  const model = useModel('Space.model');

  const files = _files === undefined ? model.selectedFiles : _files;
  const mini = _mini === true;

  const renderShare = useCallback(
    (key: string, mini: boolean) => (
      <CreateShareForm
        key={key}
        path={model.params.path}
        files={files}
        trigger={
          <OperationButton
            type="primary"
            title="分享"
            icon={<ShareAltOutlined />}
            mini={mini}
          />
        }
      />
    ),
    [files, model.params.path],
  );

  const renderCreateDocument = useCallback(
    (key: string, mini: boolean) => (
      <CreateDocumentFormButton
        key={key}
        basePath={model.params.path}
        onFinish={async () => {
          await model.refresh();
          return true;
        }}
        trigger={
          <OperationButton
            type="primary"
            title="新建文档"
            icon={<FileOutlined />}
            mini={mini}
          />
        }
      />
    ),
    [model.refresh, model.params.path],
  );

  const renderCreateFolder = useCallback(
    (key: string, mini: boolean) => (
      <CreateFolderFormButton
        key={key}
        basePath={model.params.path}
        onFinish={async () => {
          await model.refresh();
          return true;
        }}
        trigger={
          <OperationButton
            title="新建目录"
            icon={<FolderOutlined />}
            mini={mini}
          />
        }
      />
    ),
    [model.refresh, model.params.path],
  );

  const op: Operation[] = [];
  if (files.length !== 0) {
    if (!mini) {
      op.push({
        key: 'share',
        title: '分享',
        render: renderShare,
      });
    }

    op.push({
      key: 'copy',
      title: '复制',
      icon: <CopyOutlined />,
    });

    op.push({
      key: 'move',
      title: '移动',
      icon: <ScissorOutlined />,
    });

    op.push({
      key: 'delete',
      title: '删除',
      icon: <DeleteOutlined />,
      btnProps: {
        danger: true,
      },
      onClick: async () => {
        await moveIntoRecycleBin({
          path: files.map((x) => mergePath([...model.params.path, x.filename])),
        });
        message.success('成功将文件移到回收站');
        model.setSelectedFiles([]);
        await model.refresh();
      },
    });

    if (files.length === 1) {
      op.push({
        key: 'rename',
        title: '重命名',
        icon: <EditOutlined />,
      });
    }
  } else {
    op.push({
      key: 'create-document',
      title: '新建文档',
      render: renderCreateDocument,
    });
    op.push({
      key: 'create-folder',
      title: '新建目录',
      render: renderCreateFolder,
    });
  }

  return <OperationBar operations={op} mini={mini} />;
};

export default SpaceOperationBar;
